import { registerEditorWrapper } from '@editor/editor-webcomponent';
import type { EditorWrapperConfig } from '@editor/editor-webcomponent';

registerEditorWrapper();

const defaultConfig: EditorWrapperConfig = {
  editorType: 'content',
  data: {
    title: 'Untitled',
    html: '<p>Start typing…</p>',
  },
  options: {
    placeholder: 'Give it a title',
    base_url: 'https://dev-lap.prathamdigital.org',
    brandLogo: 'https://dev-lap.prathamdigital.org/logo.png',
    primaryCategories: [
      {
        name: 'Learning Resource',
        value: 'Learning Resource',
        MUIicon: 'DescriptionOutlined',
        Description: 'PDFs, videos, audio files, documents',
      },
      {
        name: 'Story',
        value: 'Story',
        MUIicon: 'MenuBookOutlined',
        Description: 'Stories, case studies, examples',
      },
      {
        name: 'Interactive',
        value: 'Interactive',
        MUIicon: 'SportsEsportsOutlined',
        Description: 'H5P, HTML ZIP, interactive exercises',
      },
      {
        name: 'Activity',
        value: 'Activity',
        MUIicon: 'EditOutlined',
        Description: 'Worksheets, exercises, hands-on tasks',
      },
    ],
  },
  theme: {
    primary: '#2980b9',
    toolbar: '#f5f5f7',
  },
};

// Course preset per docs/CONFIGURATION.md ("2. Course") from the legacy
// sunbird-collection-editor repo — primaryCategory: "Course", 2-level
// Chapter/Sub-Chapter hierarchy. `options.apiBaseUrl` is left blank here;
// set it to a real (or dev-proxy) Sunbird backend to exercise API calls.
const courseConfig: EditorWrapperConfig = {
  editorType: 'course',
  data: {
    context: {
      env: 'collection_editor',
      sid: 'demo-session-id',
      did: 'demo-device-id',
      uid: 'demo-user-id',
      channel: 'demo-channel',
      pdata: { id: 'local.sunbird.portal', ver: '1.0.0', pid: 'sunbird-portal' },
      contextRollup: {},
      tags: [],
      framework: 'demo-framework',
      user: { id: 'demo-user-id', fullName: 'Demo User' },
    },
    config: {
      mode: 'edit',
      maxDepth: 2,
      objectType: 'Collection',
      primaryCategory: 'Course',
      isRoot: true,
      iconClass: 'fa fa-book',
      children: {},
      hierarchy: {
        level1: {
          name: 'Chapter',
          type: 'unit',
          mimeType: 'application/vnd.ekstep.content-collection',
          contentType: 'Course Unit',
          iconClass: 'fa fa-folder-o',
          children: {},
        },
        level2: {
          name: 'Sub-Chapter',
          type: 'unit',
          mimeType: 'application/vnd.ekstep.content-collection',
          contentType: 'Course Unit',
          iconClass: 'fa fa-folder-o',
          children: {
            Content: ['Explanation Content', 'Learning Resource', 'eTextbook', 'Teacher Resource', 'Course Assessment'],
            QuestionSet: ['Practice Question Set'],
          },
        },
      },
    },
  },
  options: {
    // apiBaseUrl: 'https://dev-lap.prathamdigital.org',
  },
  theme: {
    primary: '#2980b9',
    toolbar: '#f5f5f7',
  },
};

const CONFIGS: Record<string, EditorWrapperConfig> = {
  content: defaultConfig,
  course: courseConfig,
};

const editorEl = document.getElementById('editor') as HTMLElement & {
  editorConfig: EditorWrapperConfig;
  getData: () => unknown;
};

const eventLog         = document.getElementById('event-log') as HTMLPreElement;
const loadBtn          = document.getElementById('load-btn') as HTMLButtonElement;
const clearBtn         = document.getElementById('clear-btn') as HTMLButtonElement;
const logDataBtn       = document.getElementById('log-data-btn') as HTMLButtonElement;
const configEditor     = document.getElementById('config-editor') as HTMLTextAreaElement;
const editorTypeSelect = document.getElementById('editor-type-select') as HTMLSelectElement;

function logEvent(name: string, detail: unknown): void {
  const ts   = new Date().toLocaleTimeString();
  const line = `[${ts}] ${name}\n${JSON.stringify(detail, null, 2)}\n\n`;
  eventLog.textContent = line + eventLog.textContent;
}

const EVENTS = ['editor:ready', 'editor:change', 'editor:save', 'editor:error', 'editor:close'];

EVENTS.forEach((evt) => {
  editorEl.addEventListener(evt, (e) => {
    logEvent(evt, (e as CustomEvent).detail);
  });
});

loadBtn.addEventListener('click', () => {
  try {
    const cfg = JSON.parse(configEditor.value) as EditorWrapperConfig;
    editorEl.editorConfig = cfg;
    logEvent('>>> config applied', { editorType: cfg.editorType });
  } catch {
    alert('Invalid JSON in config editor');
  }
});

clearBtn.addEventListener('click', () => {
  eventLog.textContent = '';
});

logDataBtn.addEventListener('click', () => {
  logEvent('>>> current data', editorEl.getData());
});

editorTypeSelect.addEventListener('change', () => {
  const cfg = CONFIGS[editorTypeSelect.value];
  if (!cfg) return;
  configEditor.value = JSON.stringify(cfg, null, 2);
  editorEl.editorConfig = cfg;
  logEvent('>>> editor type switched', { editorType: cfg.editorType });
});

// Pre-fill editor and auto-load on startup
configEditor.value = JSON.stringify(defaultConfig, null, 2);
editorEl.editorConfig = defaultConfig;
