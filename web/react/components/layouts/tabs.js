export default {
  namespace: 'tabs',
  state: {
    currentTab: '',
    tabPanes: [],
  },
  effects: {},
  reducers: {
    init() {
      return {
        currentTab: '',
        tabPanes: [],
      };
    },
    setCurrentTab(
      state,
      {
        payload: { currentTab },
      },
    ) {
      return {
        ...state,
        currentTab,
      };
    },
    addTabPanes(
      state,
      {
        payload: { pane },
      },
    ) {
      const { tabPanes } = state;
      return {
        ...state,
        tabPanes: [...tabPanes, pane],
      };
    },
    setTabPanes(
      state,
      {
        payload: { pane },
      },
    ) {
      const { tabPanes } = state;
      const oldPaneIndex = tabPanes.findIndex(i => i.pathname === pane.pathname);
      const newPane = [...tabPanes];
      newPane[oldPaneIndex] = pane;
      return {
        ...state,
        tabPanes: newPane,
      };
    },
    removeTabPanes(
      state,
      {
        payload: { paneIndex },
      },
    ) {
      const { tabPanes } = state;
      const newPane = tabPanes.filter(i => i.fullpath !== paneIndex);
      return {
        ...state,
        tabPanes: newPane,
      };
    },
    removeAnthorPanes(state, { payload }) {
      const { tabPanes } = state;
      return {
        ...state,
        currentTab: payload,
        tabPanes: tabPanes.filter(tab => tab.fullpath === payload),
      };
    },
    removeRightPanes(state, { payload }) {
      const { tabPanes, currentTab } = state;
      const idx = tabPanes.findIndex(tab => tab.fullpath === payload);
      const curIdx = tabPanes.findIndex(tab => tab.fullpath === currentTab);
      const newCur = curIdx <= idx ? currentTab : payload;
      return {
        ...state,
        currentTab: newCur,
        tabPanes: tabPanes.slice(0, idx + 1),
      };
    },
    removeLeftPanes(state, { payload }) {
      const { tabPanes, currentTab } = state;
      const idx = tabPanes.findIndex(tab => tab.fullpath === payload);
      const curIdx = tabPanes.findIndex(tab => tab.fullpath === currentTab);
      const newCur = curIdx >= idx ? currentTab : payload;
      return {
        ...state,
        currentTab: newCur,
        tabPanes: tabPanes.slice(idx),
      };
    },
  },
  subscriptions: {},
};
