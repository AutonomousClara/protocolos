'use client';

import { useState, ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  icon: ReactNode;
  content: ReactNode;
  badge?: number;
}

interface ProtocolTabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export function ProtocolTabs({ tabs, defaultTab }: ProtocolTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeTabContent = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="border-b border-border">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap
                  border-b-2 -mb-px
                  ${isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-foreground-muted hover:text-foreground hover:border-border'
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-semibold
                    ${isActive ? 'bg-primary/20 text-primary' : 'bg-surface text-foreground-muted'}
                  `}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fadeIn">
        {activeTabContent?.content}
      </div>
    </div>
  );
}
