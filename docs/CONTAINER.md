# Container guide

This project ships with a `Dockerfile` so you can run the code without
installing Python or Node locally.

Build the image:

```bash
docker build -t posedetect .
```

Start a shell inside the container:

```bash
docker run --rm -it posedetect bash
```

From there you can run tests or start the server:

```bash
make test
python -m backend.server
```

To serve the frontend build inside the container:

```bash
npm run build
python -m http.server --directory frontend/dist 8080
```

Then open <http://localhost:8080/> in your browser.
