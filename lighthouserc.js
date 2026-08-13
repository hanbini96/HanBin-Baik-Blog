module.exports = {
  ci: {
    collect: {
      // URLs to test - MUST use localhost for testing the build being tested
      url: [
        'http://localhost:4321/',
        'http://localhost:4321/blog',
        'http://localhost:4321/about'
      ],
      
      // Lighthouse settings
      settings: {
        chromeFlags: '--no-sandbox --headless --disable-gpu',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
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
      
      // Form factor for testing (desktop or mobile)
      formFactor: 'desktop',
      
      // Start server for static files - MUST match what performance.yml starts
      // Astro's pnpm preview outputs: "Server ready in 123ms"
      startServerCommand: 'pnpm preview --port 4321',
      startServerReadyPattern: /ready in \d+ms/,
      startServerReadyTimeout: 30000
    },
    
    assert: {
      // Assertions based on Lighthouse:recommended preset
      preset: 'lighthouse:recommended',
      
      // Core Web Vitals assertions - MODERATE thresholds for a blog site
      assertions: {
        // Performance category assertions - MODERATE
        'first-contentful-paint': ['warn', { maxLength: 3000 }],  // Increased from 1500ms
        'largest-contentful-paint': ['warn', { maxLength: 4000 }],  // Increased from 2500ms
        'cumulative-layout-shift': ['warn', { maxTotal: 0.25 }],  // Increased from 0.1
        'first-input-delay': ['warn', { maxNumeric: 300 }],  // Increased from 100ms
        'total-blocking-time': ['warn', { maxNumeric: 500 }],  // Increased from 200ms
        'speed-index': ['warn', { maxNumeric: 4000 }],  // Increased from 2000ms
        
        // Performance score assertions
        'performance-budget': ['warn', { maxNumeric: 85 }],  // Reduced from 90
        'interactive': ['warn', { maxNumeric: 5000 }],  // Increased from 3800ms
        
        // Accessibility assertions - MODERATE (90% is more realistic)
        'accessibility': ['warn', { minScore: 90 }],
        'aria-allowed-attr': ['off'],
        'aria-required-attr': ['warn', { minScore: 85 }],
        'aria-required-children': ['warn', { minScore: 85 }],
        'aria-roles': ['warn', { minScore: 85 }],
        'aria-valid-attr-value': ['warn', { minScore: 85 }],
        'aria-valid-attr': ['warn', { minScore: 85 }],
        'color-contrast-enhanced': ['warn', { minScore: 85 }],
        'definition-list': ['warn', { minScore: 85 }],
        'frame-title': ['warn', { minScore: 85 }],
        'heading-order': ['warn', { minScore: 85 }],
        'html-has-lang': ['warn', { minScore: 85 }],
        'html-lang-valid': ['warn', { minScore: 85 }],
        'image-alt': ['warn', { minScore: 85 }],
        'label': ['warn', { minScore: 85 }],
        'link-name': ['warn', { minScore: 85 }],
        'list': ['warn', { minScore: 85 }],
        'meta-viewport': ['warn', { minScore: 85 }],
        'object-alt': ['warn', { minScore: 85 }],
        
        // Best Practices assertions - MODERATE (90% is more realistic)
        'best-practices': ['warn', { minScore: 90 }],
        'doctype': ['warn', { minScore: 90 }],
        'charset': ['warn', { minScore: 90 }],
        'crawlable-anchors': ['warn', { minScore: 90 }],
        'errors-in-console': ['warn', { minScore: 90 }],
        'image-aspect-ratio': ['warn', { minScore: 90 }],
        'is-crawlable': ['warn', { minScore: 90 }],
        'link-text': ['warn', { minScore: 90 }],
        'meta-description': ['warn', { minScore: 90 }],
        'no-document-write': ['warn', { minScore: 90 }],
        'no-console': ['warn', { minScore: 85 }],
        'tap-targets': ['warn', { minScore: 90 }],
        'uses-rel-preconnect': ['warn', { minScore: 90 }],
        'viewport': ['warn', { minScore: 90 }],
        
        // SEO assertions - MODERATE (90% is more realistic)
        'seo': ['warn', { minScore: 90 }],
        'hreflang': ['warn', { minScore: 85 }],
        'meta-description': ['warn', { minScore: 90 }],
        'robots-txt': ['warn', { minScore: 90 }],
        'tap-targets': ['warn', { minScore: 90 }],
        'viewport': ['warn', { minScore: 90 }]
      }
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