# Directory Structure - Automa

The Automa project is a browser extension. Below is the directory tree describing an overview of the important components in the source code:

```text
├── src/
│   ├── assets/                # Contains CSS files and Fonts
│   ├── background/            # Background scripts for Service Worker
│   ├── components/            # Main Vue components divided by UI sections
│   ├── composable/            # Reusable Vue Composables
│   ├── content/               # Content Script: injected into web to interact with DOM
│   ├── db/                    # IndexedDB/Storage storage logic
│   ├── execute/               # Files used to initialize execution
│   ├── lib/                   # External libraries
│   ├── locales/               # Internationalization (i18n)
│   ├── popup/                 # Extension popup interface
│   ├── service/               # Communication service layer
│   ├── stores/                # State Management
│   ├── utils/                 # Utility support functions
│   └── workflowEngine/        # The core of Workflow
└── utils/                     # Utility scripts for Building
```

## Important Locations for Modding / Bug Fixing
- **Adding/editing features of an existing Block**: You need to intervene at 2 layers:
  1. Settings form interface: Look in the directory containing Vue components of the workflow editor.
  2. Feature processing logic: Located at the workflow engine handler (background processing) or content blocks handler (web DOM interaction).
- **Customizing UI/UX of the Workflow Editor**: Look in the workflow components directory of the editor.
