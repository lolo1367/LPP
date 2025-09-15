import React from 'react';
import styles from './Tabs.module.css';

interface TabData {
  id: string;
  title: string;
}

interface TabsProps {
  tabs: TabData[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
}

const Tabs = ({ tabs, activeTabId, onTabChange }: TabsProps) => {
  return (
    <div className={styles.tabContent}>
      <div className={styles.tabList}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${activeTabId === tab.id ? styles.active : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;