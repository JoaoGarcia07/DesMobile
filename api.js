import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { Platform } from 'react-native';

const API_PORT = '8080';
const DEFAULT_RENDER_API_BASE_URL = 'https://desbravadoresteste.onrender.com';
const REQUEST_TIMEOUT_MS = 8000;
const PROBE_TIMEOUT_MS = 2500;
const TOKEN_STORAGE_KEY = 'desmobile.auth.token';
const BASE_URL_STORAGE_KEY = 'desmobile.api.baseUrl';

let authToken = null;
let cachedBaseUrl = null;
let sessionHydrated = false;
let pendingBaseUrlResolution = null;
const memoryStorage = {};

function normalizeBaseUrl(url) {
  return String(url || '').trim().replace(/\/+$/, '');
}

function getConfiguredApiBaseUrl() {
  return normalizeBaseUrl(process.env.EXPO_PUBLIC_API_URL || DEFAULT_RENDER_API_BASE_URL);
}

function isWebRuntime() {
  return Platform.OS === 'web';
}

function hasLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

async function readStoredValue(key) {
  if (isWebRuntime()) {
    if (hasLocalStorage()) {
      try {
        const value = window.localStorage.getItem(key);
        if (value !== null) {
          memoryStorage[key] = value;
        }
        return value;
      } catch {
        return memoryStorage[key] ?? null;
      }
    }

    return memoryStorage[key] ?? null;
  }

  if (typeof SecureStore.getItemAsync === 'function') {
    try {
      const value = await SecureStore.getItemAsync(key);
      if (value !== null) {
        memoryStorage[key] = value;
      }
      return value;
    } catch {
      return memoryStorage[key] ?? null;
    }
  }

  return memoryStorage[key] ?? null;
}

async function writeStoredValue(key, value) {
  memoryStorage[key] = value;

  if (isWebRuntime()) {
    if (!hasLocalStorage()) {
      return;
    }

    try {
      window.localStorage.setItem(key, value);
    } catch {}

    return;
  }

  if (typeof SecureStore.setItemAsync === 'function') {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {}
  }
}

async function removeStoredValue(key) {
  delete memoryStorage[key];

  if (isWebRuntime()) {
    if (!hasLocalStorage()) {
      return;
    }

    try {
      window.localStorage.removeItem(key);
    } catch {}

    return;
  }

  if (typeof SecureStore.deleteItemAsync === 'function') {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {}
  }
}

function extractHost(rawValue) {
  if (!rawValue) {
    return null;
  }

  const value = String(rawValue).trim();
  if (!value) {
    return null;
  }

  const normalizedValue = /^https?:\/\//i.test(value) ? value : `http://${value}`;

  try {
    return new URL(normalizedValue).hostname || null;
  } catch {
    return null;
  }
}

function collectCandidateHosts() {
  const hosts = new Set();
  const hostHints = [
    Constants.expoConfig?.hostUri,
    Constants.expoGoConfig?.debuggerHost,
    Constants.manifest2?.extra?.expoClient?.hostUri,
    Constants.linkingUri,
  ];

  hostHints
    .map(extractHost)
    .filter(Boolean)
    .forEach((host) => hosts.add(host));

  if (typeof window !== 'undefined' && window.location?.hostname) {
    hosts.add(window.location.hostname);
  }

  if (Platform.OS === 'android') {
    hosts.add('10.0.2.2');
  }

  hosts.add('localhost');
  hosts.add('127.0.0.1');

  return Array.from(hosts);
}

function buildBaseUrl(host) {
  return `http://${host}:${API_PORT}`;
}

async function probeBaseUrl(baseUrl) {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS) : null;

  try {
    const response = await fetch(`${baseUrl}/login`, {
      method: 'GET',
      signal: controller?.signal,
    });

    return response.ok || response.status < 500;
  } catch {
    return false;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

export async function hydrateSession() {
  if (sessionHydrated) {
    return { token: authToken, baseUrl: cachedBaseUrl };
  }

  const [storedToken, storedBaseUrl] = await Promise.all([
    readStoredValue(TOKEN_STORAGE_KEY),
    readStoredValue(BASE_URL_STORAGE_KEY),
  ]);

  authToken = storedToken || null;
  cachedBaseUrl = storedBaseUrl || null;
  sessionHydrated = true;

  return { token: authToken, baseUrl: cachedBaseUrl };
}

export async function resolveApiBaseUrl(forceRefresh = false) {
  await hydrateSession();

  const configuredBaseUrl = getConfiguredApiBaseUrl();

  if (configuredBaseUrl) {
    if (cachedBaseUrl !== configuredBaseUrl) {
      cachedBaseUrl = configuredBaseUrl;
      await writeStoredValue(BASE_URL_STORAGE_KEY, configuredBaseUrl);
    }

    return configuredBaseUrl;
  }

  if (!forceRefresh && cachedBaseUrl) {
    return cachedBaseUrl;
  }

  if (pendingBaseUrlResolution && !forceRefresh) {
    return pendingBaseUrlResolution;
  }

  pendingBaseUrlResolution = (async () => {
    const candidates = [];

    if (cachedBaseUrl) {
      candidates.push(cachedBaseUrl);
    }

    collectCandidateHosts().forEach((host) => candidates.push(buildBaseUrl(host)));

    const uniqueCandidates = Array.from(new Set(candidates));

    for (const candidate of uniqueCandidates) {
      if (await probeBaseUrl(candidate)) {
        cachedBaseUrl = candidate;
        await writeStoredValue(BASE_URL_STORAGE_KEY, candidate);
        return candidate;
      }
    }

    const fallbackBaseUrl = uniqueCandidates[0] || buildBaseUrl('localhost');
    cachedBaseUrl = fallbackBaseUrl;
    await writeStoredValue(BASE_URL_STORAGE_KEY, fallbackBaseUrl);
    return fallbackBaseUrl;
  })();

  try {
    return await pendingBaseUrlResolution;
  } finally {
    pendingBaseUrlResolution = null;
  }
}

export async function setAuthToken(token) {
  authToken = token || null;

  if (authToken) {
    await writeStoredValue(TOKEN_STORAGE_KEY, authToken);
    return;
  }

  await removeStoredValue(TOKEN_STORAGE_KEY);
}

export async function clearSession() {
  authToken = null;
  await removeStoredValue(TOKEN_STORAGE_KEY);
}

export async function restoreSession() {
  const { token } = await hydrateSession();
  return token;
}

export function getCachedApiBaseUrl() {
  return cachedBaseUrl;
}

export function isUnauthorizedError(error) {
  return error?.response?.status === 401;
}

export async function resolveAssetUrl(path) {
  if (!path) {
    return null;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const baseUrl = await resolveApiBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

const api = axios.create({
  timeout: REQUEST_TIMEOUT_MS,
});

api.interceptors.request.use(async (config) => {
  await hydrateSession();

  config.baseURL = config.baseURL || await resolveApiBaseUrl();
  config.headers = config.headers || {};

  if (authToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (isUnauthorizedError(error)) {
      await clearSession();
    }

    return Promise.reject(error);
  }
);

export default api;
