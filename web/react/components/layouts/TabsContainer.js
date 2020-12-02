import React, { useEffect } from 'react';
import { connect } from 'dva';
import { withRouter, router, Redirect } from 'umi';

import { Tabs, Icon, Dropdown, Menu } from 'antd';

import styled from 'styled-components';
import compose from '@/fe-sdk/utils/compose';
import Authorized from '@/utils/Authorized';
import getIn from '@/js-sdk/native/getIn';

const tabsModels = modelsFactory({
  /* namespace */
  namespace: 'tabs',
  state: {
    currentTab: '',
    tabPanes: [],
  },
  reducers: {
    init() {
      return {
        currentTab: '',
        tabPanes: [],
      };
    },
    setCurrentTab(state, { payload: { currentTab } }) {
      return {
        ...state,
        currentTab,
      };
    },
    addTabPanes(state, { payload: { pane } }) {
      const { tabPanes } = state;
      return {
        ...state,
        tabPanes: [...tabPanes, pane],
      };
    },
    setTabPanes(state, { payload: { pane } }) {
      const { tabPanes } = state;
      const oldPaneIndex = tabPanes.findIndex(
        i => i.pathname === pane.pathname,
      );
      const newPane = [...tabPanes];
      newPane[oldPaneIndex] = pane;
      return {
        ...state,
        tabPanes: newPane,
      };
    },
    removeTabPanes(state, { payload: { paneIndex } }) {
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
  request,
  message,
});

const { TabPane } = Tabs;

/* 样式 */
const CusTabs = styled(Tabs)`
  &.ant-tabs-card > .ant-tabs-content {
    margin-top: -16px;
  }

  &.ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
    background: #fff;
    padding: 16px;
  }

  &.ant-tabs-card > .ant-tabs-bar {
    border-color: #fff;
  }

  &.ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
    border-color: #fff;
    background: #fff;
  }
  .ant-tabs-nav .ant-tabs-tab .anticon {
    margin-right: 0;
  }
  &.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
    padding: 0;
  }
`;
/* 样式结束 */

/* 鉴权器 */
function getRouterAuthority(pathname, routeData) {
  let routeAuthority = ['noAuthority'];
  const getAuthority = (key, routes) => {
    routes.map(route => {
      if (route.path === key) {
        routeAuthority = route.authority;
      } else if (route.routes) {
        routeAuthority = getAuthority(key, route.routes);
      }
      return route;
    });
    return routeAuthority;
  };
  return getAuthority(pathname, routeData);
}
/* 鉴权器 */

/**
 * DFS查找， BFS没想出来=- =用some方法，查找到就自动break, 优化性能
 * @param {当前路径名} pathname : string
 * @param {所有路由配置} routes ：array[route]
 */
function findCurrentRoute(pathname, routes) {
  let currentRoute;
  routes.some(route => {
    const { routes: cRoutes, path } = route;
    if (path === pathname) {
      currentRoute = route;
      return true;
    }
    if (cRoutes) {
      currentRoute = findCurrentRoute(pathname, cRoutes);
      return currentRoute || false;
    }
    return false;
  });
  return currentRoute;
}

const TabsContainer = ({
  dispatch,
  tabPanes,
  currentTab,
  children,
  routes,
  location,
}) => {
  useEffect(() => {
    app.replaceModel(tabsModels);
  }, []);

  const { pathname, search, query } = location;

  const title = getIn(query, ['tabTitle'], '空标题');

  const routerConfig = getRouterAuthority(pathname, routes);
  const fullpath = `${pathname}?${decodeURI(search.replace(/^\?/, ''))}`;

  /**
   * 监听router变化 记录历史记录， 详细流程见doc下流程图
   */
  function tabsHandler() {
    const currentRoute = findCurrentRoute(pathname, routes);
    if (!currentRoute) return;
    const { multiple, component, name = title } = currentRoute;
    if (!component) return;

    const basePane = {
      pathname,
      search,
      fullpath,
      query,
      component,
      name,
    };

    if (multiple) {
      const finedPane = tabPanes.some(
        pane => pane && pane.fullpath === fullpath,
      );
      if (!finedPane) {
        dispatch({
          type: 'tabs/addTabPanes',
          payload: {
            pane: basePane,
          },
        });
      }
    } else {
      const finedPane = tabPanes.find(
        pane => pane && pane.pathname === pathname,
      );
      if (finedPane) {
        if (finedPane.search !== search) {
          dispatch({
            type: 'tabs/setTabPanes',
            payload: {
              pane: basePane,
            },
          });
        }
      } else {
        dispatch({
          type: 'tabs/addTabPanes',
          payload: {
            pane: basePane,
          },
        });
      }
    }
    dispatch({
      type: 'tabs/setCurrentTab',
      payload: {
        currentTab: fullpath,
      },
    });
  }

  // 删除对应tab
  function removeTab(key) {
    const currentIndex = tabPanes.findIndex(
      tabPane => tabPane.fullpath === fullpath,
    );
    if (key === fullpath) {
      const newTab =
        currentIndex === 0 ? tabPanes[1] : tabPanes[currentIndex - 1];
      router.push(newTab.fullpath);
    }
    dispatch({
      type: 'tabs/removeTabPanes',
      payload: {
        paneIndex: key,
      },
    });
  }
  const menu = curTab => (
    <Menu>
      <Menu.Item
        key="0"
        disabled={tabPanes.length <= 1}
        onClick={() => {
          removeTab(curTab);
        }}
      >
        关闭
      </Menu.Item>
      <Menu.Item
        key="1"
        onClick={() => {
          router.replace({ pathname, query });
        }}
      >
        刷新
      </Menu.Item>
      <Menu.Divider></Menu.Divider>
      <Menu.Item
        key="2"
        onClick={() => {
          dispatch({ type: 'tabs/removeAnthorPanes', payload: curTab });
        }}
      >
        关闭其它
      </Menu.Item>
      <Menu.Item
        key="3"
        onClick={() => {
          dispatch({ type: 'tabs/removeLeftPanes', payload: curTab });
        }}
      >
        关闭左侧
      </Menu.Item>
      <Menu.Item
        key="4"
        onClick={() => {
          dispatch({ type: 'tabs/removeRightPanes', payload: curTab });
        }}
      >
        关闭右侧
      </Menu.Item>
    </Menu>
  );

  // 自定义标题头
  function renderTabTitle(key, name = title, tabPane) {
    return (
      <Dropdown overlay={menu(key)} trigger={['contextMenu']}>
        <div
          style={{ display: 'flex', alignItems: 'center', padding: '0 16px' }}
          onClick={() => {
            const { pathname: _pathname, query: _query } = tabPane;
            router.push({
              pathname: _pathname,
              query: _query,
            });
          }}
        >
          <div>{name}</div>
          {tabPanes.length > 1 && (
            <Icon
              type="close"
              onClick={e => {
                e.stopPropagation();
                removeTab(key);
              }}
              style={{
                color: 'red',
                marginLeft: '.5em',
              }}
            />
          )}
        </div>
      </Dropdown>
    );
  }

  useEffect(() => {
    tabsHandler();
  }, [pathname, search]);

  return (
    <div>
      {tabPanes.length > 0 ? (
        <CusTabs hideAdd type="editable-card" activeKey={currentTab}>
          {tabPanes.map(tabPane => {
            const {
              fullpath: key,
              name,
              component: Component,
              // pathname: tPatnname
            } = tabPane;
            // 当前组件保存在就模型里性能更快， 如果标签过多，可以每次查询
            // const curRoute = findCurrentRoute(tPatnname, routes);
            // const { name, component: Component } = curRoute;

            return (
              <TabPane
                key={key}
                tab={renderTabTitle(key, name, tabPane)}
                closable={false}
              >
                <Authorized
                  authority={routerConfig}
                  noMatch={<Redirect to="/exception/403" />}
                >
                  <Component />
                </Authorized>
              </TabPane>
            );
          })}
        </CusTabs>
      ) : (
        <Authorized
          authority={routerConfig}
          noMatch={<Redirect to="/exception/403" />}
        >
          {children}
        </Authorized>
      )}
    </div>
  );
};

export default compose(
  connect(({ tabs: { tabPanes, currentTab } }) => ({ tabPanes, currentTab })),
  withRouter,
)(TabsContainer);
