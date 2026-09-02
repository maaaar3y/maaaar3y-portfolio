const fs = require('fs');
const { opendir, opendirSync } = fs;

// Retry wrapper for async functions that may fail with EAGAIN
function withRetry(asyncFn, retries = 20, delayMs = 50) {
  return async function(...args) {
    for (let i = 0; i < retries; i++) {
      try {
        return await asyncFn.apply(this, args);
      } catch (e) {
        if (e && (e.code === 'EAGAIN' || e.code === 'ENFILE' || e.code === 'EMFILE')) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
          continue;
        }
        throw e;
      }
    }
    return asyncFn.apply(this, args);
  };
}

function withRetrySync(syncFn, retries = 20, delayMs = 50) {
  return function(...args) {
    for (let i = 0; i < retries; i++) {
      try {
        return syncFn.apply(this, args);
      } catch (e) {
        if (e && (e.code === 'EAGAIN' || e.code === 'ENFILE' || e.code === 'EMFILE')) {
          const start = Date.now();
          while (Date.now() - start < delayMs) {}
          continue;
        }
        throw e;
      }
    }
    return syncFn.apply(this, args);
  };
}

// Patch fs.readdirSync
fs.readdirSync = withRetrySync(fs.readdirSync);

// Patch fs.readdir (callback-based)
const origReaddir = fs.readdir;
fs.readdir = function(path, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }
  let retries = 20;
  function attempt() {
    origReaddir.call(this, path, options, function(err, files) {
      if (err && (err.code === 'EAGAIN' || err.code === 'ENFILE' || err.code === 'EMFILE') && retries > 0) {
        retries--;
        setTimeout(attempt, 50);
      } else {
        callback(err, files);
      }
    });
  }
  attempt();
};

// Patch fs.promises.readdir
if (fs.promises && fs.promises.readdir) {
  fs.promises.readdir = withRetry(fs.promises.readdir.bind(fs.promises));
}

// Patch fs.opendir (async)
if (fs.opendir) {
  fs.opendir = withRetry(fs.opendir.bind(fs));
}

// Patch fs.opendirSync
if (fs.opendirSync) {
  fs.opendirSync = withRetrySync(fs.opendirSync);
}

// Patch fs.promises.opendir
if (fs.promises && fs.promises.opendir) {
  fs.promises.opendir = withRetry(fs.promises.opendir.bind(fs.promises));
}

// Patch fs.realpathSync
fs.realpathSync = withRetrySync(fs.realpathSync);

// Patch fs.realpath
const origRealpath = fs.realpath;
fs.realpath = function(path, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }
  let retries = 20;
  function attempt() {
    origRealpath.call(this, path, options, function(err, resolved) {
      if (err && (err.code === 'EAGAIN' || err.code === 'ENFILE' || err.code === 'EMFILE') && retries > 0) {
        retries--;
        setTimeout(attempt, 50);
      } else {
        callback(err, resolved);
      }
    });
  }
  attempt();
};

// Patch fs.promises.realpath
if (fs.promises && fs.promises.realpath) {
  fs.promises.realpath = withRetry(fs.promises.realpath.bind(fs.promises));
}

// Patch fs.statSync
fs.statSync = withRetrySync(fs.statSync);

// Patch fs.stat
const origStat = fs.stat;
fs.stat = function(path, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }
  let retries = 20;
  function attempt() {
    origStat.call(this, path, options, function(err, stats) {
      if (err && (err.code === 'EAGAIN' || err.code === 'ENFILE' || err.code === 'EMFILE') && retries > 0) {
        retries--;
        setTimeout(attempt, 50);
      } else {
        callback(err, stats);
      }
    });
  }
  attempt();
};

// Patch fs.promises.stat
if (fs.promises && fs.promises.stat) {
  fs.promises.stat = withRetry(fs.promises.stat.bind(fs.promises));
}

// Patch fs.lstatSync
fs.lstatSync = withRetrySync(fs.lstatSync);

// Patch fs.lstat
const origLstat = fs.lstat;
fs.lstat = function(path, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }
  let retries = 20;
  function attempt() {
    origLstat.call(this, path, options, function(err, stats) {
      if (err && (err.code === 'EAGAIN' || err.code === 'ENFILE' || err.code === 'EMFILE') && retries > 0) {
        retries--;
        setTimeout(attempt, 50);
      } else {
        callback(err, stats);
      }
    });
  }
  attempt();
};

// Patch fs.promises.lstat
if (fs.promises && fs.promises.lstat) {
  fs.promises.lstat = withRetry(fs.promises.lstat.bind(fs.promises));
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {},
  webpack: (config, { dev, isServer }) => {
    config.cache = false;
    config.snapshot = {
      managedPaths: [],
      immutablePaths: [],
    };
    return config;
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};
module.exports = nextConfig;
