# Sample data

This directory holds sample PNG frames and labels for performance tests.
Placeholder images and a `labels.json` file are provided so the suite runs.
Replace them with real frames to check accuracy. The images should be small to
keep runtime low.
Each entry in `labels.json` must look like:

```json
[
  {"image": "frame1.png", "landmarks": [{"x": 0.1, "y": 0.2}, ...]},
  {"image": "frame2.png", "landmarks": [...]}
]
```

The accuracy test skips when real frames are not supplied.
