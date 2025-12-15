import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import App from '@/App.tsx';
import { useAntigravityAccount } from '@/modules/use-antigravity-account.ts';
import {
  useAccountAdditionData,
  type AccountAdditionData,
  type UserTier,
} from '@/modules/use-account-addition-data.ts';
import { useDbMonitoringStore } from '@/modules/db-monitoring-store';
import { useAntigravityIsRunning } from '@/hooks/use-antigravity-is-running.ts';
import { useImportExportAccount } from '@/modules/use-import-export-accounts.ts';
import { useSignInNewAntigravityAccount } from '@/hooks/use-sign-in-new-antigravity-account.ts';
import type { AntigravityAccount } from '@/commands/types/account.types.ts';
import { PlatformCommands } from '@/commands/PlatformCommands.ts';
import { TrayCommands } from '@/commands/TrayCommands.ts';

// Storybook 下不需要真实原生能力；只提供空壳避免运行时报错。
if (typeof window !== 'undefined') {
  const w = window as any;
  w.__TAURI_INTERNALS__ ??= {
    invoke: async () => null,
    transformCallback: () => 0,
    convertFileSrc: (p: string) => p,
  };
  w.__TAURI_EVENT_PLUGIN_INTERNALS__ ??= { unregisterListener: () => {} };
}

PlatformCommands.detectInstallation = async () => null as any;
TrayCommands.updateMenu = async () => '';

const makeAccount = (opts: {
  email: string;
  planName: string;
  tier: UserTier;
  accessToken: string;
  idToken: string;
}): AntigravityAccount =>
  ({
    auth: {
      access_token: opts.accessToken,
      id_token: opts.idToken,
      meta: { expiry_timestamp: Date.now() + 60 * 60 * 1000 },
      type: 'oauth',
    },
    context: {
      email: opts.email,
      models: {
        items: [],
        recommended: { names: [], unknown_f2_base64: '' },
        unknown_f3_base64: '',
      } as any,
      plan: {
        description: '',
        name: opts.tier,
        slug: opts.tier,
        upgrade_msg: '',
        upgrade_url: '',
      } as any,
      plan_name: opts.planName,
      status: 1,
    },
  } as unknown as AntigravityAccount);

const seedMocks = (
  accounts: AntigravityAccount[],
  additionData: Record<string, AccountAdditionData>
) => {
  useAntigravityAccount.setState({
    accounts,
    currentAuthInfo: accounts[0] ?? null,
    getAccounts: async () => accounts,
    delete: async () => {},
    insertOrUpdateCurrentAccount: async () => {},
    switchToAccount: async () => {},
    clearAllAccounts: async () => {},
  });

  useAccountAdditionData.setState({
    data: additionData,
    update: async () => {},
  });

  useDbMonitoringStore.setState({
    start: async () => {},
    stop: async () => {},
    addListener: () => () => {},
  });

  useAntigravityIsRunning.setState({
    isRunning: false,
    isChecking: false,
    lastChecked: null,
    check: async () => {},
    start: () => {},
    stop: () => {},
  });

  useImportExportAccount.setState({
    isImporting: false,
    isExporting: false,
    isCheckingData: false,
    importDialogIsOpen: false,
    exportDialogIsOpen: false,
    pendingImportPath: undefined,
    pendingExportData: undefined,
    setImporting: () => {},
    setExporting: () => {},
    setCheckingData: () => {},
    openImportDialog: () => {},
    closeImportDialog: () => {},
    openExportDialog: () => {},
    closeExportDialog: () => {},
    submitImportPassword: async () => {},
    submitExportPassword: async () => {},
    importConfig: async () => {},
    exportConfig: async () => {},
  });

  useSignInNewAntigravityAccount.setState({
    processing: false,
    run: async () => {},
  });
};

const mockAccounts: AntigravityAccount[] = [
  makeAccount({
    email: 'admin.ops@company.com',
    planName: 'Admin User',
    tier: 'g1-pro-tier',
    accessToken: 'sk_mock_admin',
    idToken: 'id_mock_admin',
  }),
  makeAccount({
    email: 'jason.bourne@cia.gov',
    planName: 'Jason Bourne',
    tier: 'free-tier',
    accessToken: 'sk_mock_jason',
    idToken: 'id_mock_jason',
  }),
  makeAccount({
    email: 'guest.temp@provider.net',
    planName: 'Unknown Guest',
    tier: 'g1-ultra-tier',
    accessToken: 'sk_mock_guest',
    idToken: 'id_mock_guest',
  }),
  makeAccount({
    email: 'sarah.connor@skynet.ai',
    planName: 'Sarah Connor',
    tier: 'g1-pro-tier',
    accessToken: 'sk_mock_sarah',
    idToken: 'id_mock_sarah',
  }),
  makeAccount({
    email: 'bruce.wayne@wayneenterprises.com',
    planName: 'Bruce Wayne',
    tier: 'g1-ultra-tier',
    accessToken: 'sk_mock_bruce',
    idToken: 'id_mock_bruce',
  }),
  makeAccount({
    email: 'ellen.ripley@weyland.com',
    planName: 'Ellen Ripley',
    tier: 'free-tier',
    accessToken: 'sk_mock_ripley',
    idToken: 'id_mock_ripley',
  }),
  makeAccount({
    email: 'neo.anderson@matrix.io',
    planName: 'Neo Anderson',
    tier: 'g1-pro-tier',
    accessToken: 'sk_mock_neo',
    idToken: 'id_mock_neo',
  }),
  makeAccount({
    email: 'trinity@matrix.io',
    planName: 'Trinity',
    tier: 'free-tier',
    accessToken: 'sk_mock_trinity',
    idToken: 'id_mock_trinity',
  }),
  makeAccount({
    email: 'deckard@blade.runner',
    planName: 'Rick Deckard',
    tier: 'g1-ultra-tier',
    accessToken: 'sk_mock_deckard',
    idToken: 'id_mock_deckard',
  }),
];

const mockAdditionData: Record<string, AccountAdditionData> = {
  'admin.ops@company.com': {
    geminiQuote: 0.85,
    claudeQuote: 0.92,
    userAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Admin',
    userId: 'mock_admin',
  },
  'jason.bourne@cia.gov': {
    geminiQuote: 0.15,
    claudeQuote: 0.4,
    userAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Jason',
    userId: 'mock_jason',
  },
  'guest.temp@provider.net': {
    geminiQuote: -1,
    claudeQuote: 0.05,
    userAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Guest',
    userId: 'mock_guest',
  },
  'sarah.connor@skynet.ai': {
    geminiQuote: 0.62,
    claudeQuote: 0.7,
    userAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah',
    userId: 'mock_sarah',
  },
  'bruce.wayne@wayneenterprises.com': {
    geminiQuote: 0.95,
    claudeQuote: 0.88,
    userAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Bruce',
    userId: 'mock_bruce',
  },
  'ellen.ripley@weyland.com': {
    geminiQuote: 0.3,
    claudeQuote: 0.2,
    userAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Ripley',
    userId: 'mock_ripley',
  },
  'neo.anderson@matrix.io': {
    geminiQuote: 0.55,
    claudeQuote: 0.6,
    userAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Neo',
    userId: 'mock_neo',
  },
  'trinity@matrix.io': {
    geminiQuote: 0.25,
    claudeQuote: 0.45,
    userAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Trinity',
    userId: 'mock_trinity',
  },
  'deckard@blade.runner': {
    geminiQuote: 0.1,
    claudeQuote: 0.12,
    userAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Deckard',
    userId: 'mock_deckard',
  },
};

const meta = {
  title: 'App/App',
  component: App,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light-gray',
      values: [
        { name: 'light-gray', value: '#f8fafc' },
        { name: 'dark', value: '#0f172a' },
      ],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof App>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    seedMocks(mockAccounts, mockAdditionData);
    return <App />;
  },
};

export const EmptyState: Story = {
  render: () => {
    seedMocks([], {});
    return <App />;
  },
};
