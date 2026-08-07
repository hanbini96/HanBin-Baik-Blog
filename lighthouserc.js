module.exports = {
  ci: {
    collect: {
      // URLs to test
      url: [
        'https://hanbini96.github.io/HanBin-Baik-Blog/',
        'https://hanbini96.github.io/HanBin-Baik-Blog/blog',
        'https://hanbini96.github.io/HanBin-Baik-Blog/about'
      ],
      
      // Lighthouse settings
      settings: {
        chromeFlags: '--no-sandbox --headless --disable-gpu',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        formFactor: 'desktop',
        screenEmulatedFormFactor: false,
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        },
        extraHeaders: {
          'Accept-Language': 'en-US,en;q=0.9'
        }
      },
      
      // Number of runs per URL
      numberOfRuns: 3,
      
      // Start server for static files
      startServerCommand: 'npx serve public --no-clipboard --listen ${PORT}',
      startServerReadyPattern: /Local:/,
      startServerReadyTimeout: 5000
    },
    
    assert: {
      // Assertions based on Lighthouse:recommended preset
      preset: 'lighthouse:recommended',
      
      // Core Web Vitals assertions
      assertions: {
        // Performance category assertions
        'first-contentful-paint': ['warn', { maxLength: 1500 }],
        'largest-contentful-paint': ['error', { maxLength: 2500 }],
        'cumulative-layout-shift': ['error', { maxTotal: 0.1 }],
        'first-input-delay': ['warn', { maxNumeric: 100 }],
        'total-blocking-time': ['warn', { maxNumeric: 200 }],
        'speed-index': ['warn', { maxNumeric: 2000 }],
        
        // Performance score assertions
        'performance-budget': ['error', { maxNumeric: 90 }],
        'interactive': ['warn', { maxNumeric: 3800 }],
        
        // Accessibility assertions (should be 100)
        'accessibility': ['error', { minScore: 95 }],
        'aria-allowed-attr': ['off'],
        'aria-required-attr': ['error', { minScore: 95 }],
        'aria-required-children': ['error', { minScore: 95 }],
        'aria-roles': ['error', { minScore: 95 }],
        'aria-valid-attr-value': ['error', { minScore: 95 }],
        'aria-valid-attr': ['error', { minScore: 95 }],
        'color-contrast-enhanced': ['error', { minScore: 95 }],
        'definition-list': ['error', { minScore: 95 }],
        'dlitem': ['error', { minScore: 95 }],
        'duplicate-id': ['error', { minScore: 95 }],
        'frame-title': ['error', { minScore: 95 }],
        'heading-order': ['error', { minScore: 95 }],
        'html-has-lang': ['error', { minScore: 95 }],
        'html-lang-valid': ['error', { minScore: 95 }],
        'image-alt': ['error', { minScore: 95 }],
        'input-image-alt': ['error', { minScore: 95 }],
        'label': ['error', { minScore: 95 }],
        'link-name': ['error', { minScore: 95 }],
        'list': ['error', { minScore: 95 }],
        'listitem': ['error', { minScore: 95 }],
        'meta-viewport': ['error', { minScore: 95 }],
        'object-alt': ['error', { minScore: 95 }],
        'tabindex': ['error', { minScore: 95 }],
        
        // Best Practices assertions (should be 100)
        'best-practices': ['error', { minScore: 95 }],
        'doctype': ['error', { minScore: 95 }],
        'charset': ['error', { minScore: 95 }],
        'crawlable-anchors': ['error', { minScore: 95 }],
        'errors-in-console': ['error', { minScore: 95 }],
        'image-aspect-ratio': ['error', { minScore: 95 }],
        'is-crawlable': ['error', { minScore: 95 }],
        'link-text': ['error', { minScore: 95 }],
        'meta-description': ['error', { minScore: 95 }],
        'no-document-write': ['error', { minScore: 95 }],
        'no-console': ['warn', { minScore: 95 }],
        'tap-targets': ['error', { minScore: 95 }],
        'uses-rel-preconnect': ['error', { minScore: 95 }],
        'viewport': ['error', { minScore: 95 }],
        
        // SEO assertions (should be 100)
        'seo': ['error', { minScore: 95 }],
        'hreflang': ['error', { minScore: 95 }],
        'link-name': ['error', { minScore: 95 }],
        'meta-description': ['error', { minScore: 95 }],
        'robots-txt': ['error', { minScore: 95 }],
        'tap-targets': ['error', { minScore: 95 }],
        'viewport': ['error', { minScore: 95 }]
      }
    },
    
    upload: {
      // Upload to temporary public storage for review
      target: 'temporary-public-storage',
      
      // Keep reports for 30 days
      cleanup: true
    },
    
    // GitHub integration
    githubApp: {
      // Token will be provided via GitHub Actions secrets
      token: process.env.LHCI_GITHUB_APP_TOKEN
    }
  }
};
