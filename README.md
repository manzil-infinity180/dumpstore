# 🧠 DumpStore — Dump Your Links, Store Your Knowledge
A full-stack open-source bookmarking platform to save, organize, and search your web knowledge. Built for productivity nerds, power users, and curious minds.

<a href="https://deepwiki.com/manzil-infinity180/dumpstore">
  <img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki">
</a>

<div align="center"> <img width="100%" alt="Dumpstore Screenshot" src="https://github.com/user-attachments/assets/a8d83477-a55b-4134-a398-fe2e8c9b4fb7"> </div>

# 🔗 Project Links
| Component                                                                            | Description                           | Tech Stack                     |
| ------------------------------------------------------------------------------------ | ------------------------------------- | ------------------------------ |
| [Frontend](https://github.com/manzil-infinity180/dumpstore/tree/main/frontend)                 | UI built in React for web interaction | React (TypeScript)             |
| [Backend](https://github.com/manzil-infinity180/dumpstore/tree/main/backend)                   | REST APIs, scrapers, logic, and CI/CD | Express (TS), Python, Docker   |
| [Chrome Extension](https://github.com/manzil-infinity180/dumpstore/tree/main/chrome-extension) | Add/search bookmarks in-browser       | HTML, React (TS), Webpack      |
| [Helm Chart](https://manzil-infinity180.github.io/dumpstore/)                        | Installable via Helm / ArgoCD         | Helm, Kubernetes, GitHub Pages |

### 🔖 Key Features
```ts
✅ Import Chrome Bookmarks
Easily migrate all your existing bookmarks.

✅ Drag-and-Drop Reordering
Sort and arrange links visually.

✅ Custom Tags & Topics
Organize links with custom metadata.

✅ Auto Tag/Topic/Description Generation
Powered by Gemini API and Hugging Face (BERT).

✅ Custom Thumbnails
Replace boring favicons with your own images.

✅ Chrome Extension
Search and save bookmarks instantly while browsing.
```

___________________________________

### 🔖 What’s it all about?  
Tired of losing track of important links? Our bookmark tool helps you organize, customize, and keep your web life on track with these awesome features:

* `Import Chrome Bookmarks`: Seamlessly bring over all your saved links.
* `Drag-and-Drop`: Easily reorder your bookmarks with a simple drag.
* `Customization`: Use tags and topics to categorize your bookmarks.
* `Automatic Generation`: Let our tool generate tags, topics, and descriptions for your bookmarks using the Gemini API / Hugging Face(BERT)!
* `Custom Images`: Upload your own images for your bookmarks instead of relying on default favicons.
* `Chrome Extension`: Search and add bookmarks right from your browser.
---

# ⚙️ Deployment Options
🔧 Using Helm (Kubernetes Native)
This app comes ready-to-deploy via Helm on any Kubernetes cluster. It supports GitOps through ArgoCD and is CI/CD enabled for GHCR.

📦 Add Repo & Install

```
helm repo add dumpstore https://manzil-infinity180.github.io/dumpstore
helm install my-dumpstore dumpstore/dumpstore
```
To install directly from local repo:
```
helm upgrade --install dumpstore ./helm/dumpstore -f ./helm/dumpstore/values.yaml
```
### 📄 View Available Versions
Check `index.yaml` for the list of chart versions.

## 🛡️ Network Policies
A sample NetworkPolicy manifest is available:
```
manifest/networkpolicy/dumpstore-example.yaml
```
Refer to the [docs/](https://github.com/manzil-infinity180/dumpstore/tree/main/docs) directory for setup instructions.


![image](https://github.com/user-attachments/assets/fd48a185-b45f-4e7b-a511-2f1d1b31369b)


## 🛠️ Project Structure

```
.
├── artifacthub-repo.yml        # ArtifactHub metadata
├── backend                     # Express + Python APIs
├── chrome-extension            # React-based extension
├── compose.yaml                # Docker Compose for local dev
├── docs                        # Setup guides, usage docs
├── frontend                    # Web client (React)
├── helm                        # Helm chart for K8s deployment
├── Makefile                    # Dev utility commands
├── manifest                    # K8s manifests (incl. NetworkPolicy)
├── pass.md                     # Encrypted credentials (ignore)
├── README.md                   # You're here!
└── utils                       # Shared logic/utilities
```

## 🚀 Tech Stack Highlights
```ts
Frontend: React (TypeScript)
Backend: Express (TypeScript), Python, Scraper Engine
CI/CD: GitHub Actions for Docker + Artifact builds
Kubernetes: Helm, ArgoCD, Network Policies
AI Integration: Gemini API / HuggingFace for content understanding
Browser Extension: React + Webpack
```

## 📣 Share the Word
If you love it, give it a ⭐️ on GitHub and tweet about it with the hashtag #DumpStore!
