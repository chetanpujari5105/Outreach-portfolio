# Frame & Field performance

Lighthouse 13.6 measured the standalone homepage on the local production HTML renderer using headless Chrome 158. Each run used a new browser profile. The default mobile and desktop presets alternated across three runs each. These are lab measurements on this laptop. Hosting latency and visitors’ real devices can change the results.

| Profile | Performance | Accessibility | Best practices | LCP | CLS | Total blocking time |
|---|---:|---:|---:|---:|---:|---:|
| mobile 1 | 75 | 100 | 100 | 1.966 s | 0.000 | 1290 ms |
| mobile 2 | 98 | 100 | 100 | 2.497 s | 0.003 | 6 ms |
| mobile 3 | 97 | 100 | 100 | 2.632 s | 0.003 | 33 ms |
| **mobile median** | 97 | 100 | 100 | 2.497 s | 0.003 | 33 ms |
| desktop 1 | 100 | 100 | 100 | 0.583 s | 0.009 | 0 ms |
| desktop 2 | 100 | 100 | 100 | 0.599 s | 0.009 | 0 ms |
| desktop 3 | 100 | 100 | 100 | 0.517 s | 0.009 | 1 ms |
| **desktop median** | 100 | 100 | 100 | 0.583 s | 0.009 | 0 ms |

The mobile cover has a dedicated 800-pixel crop. The serif display font is a local static subset. The first mobile run recorded 1,290 ms of blocking time and is included in the median. See [browser QA](qa.md) for keyboard, gallery and form coverage.
