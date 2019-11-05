import getIn from './getIn';

/**
 *
 * @param {名称空间} namespace string
 * @param {异步请求} apis { string ?: *function }
 * @param {action} reducers { function }
 * @param {订阅者} subscriptions { function }
 */
export default ({
  namespace,
  state: store = {},
  apis,
  reducers = {},
  subscriptions = {},
  message,
  request,
}) => {
  const options = { namespace, apis, request };

  Object.keys(options).forEach(i => {
    if (options[i] === undefined) {
      throw new Error(`Option: ${i} is required!`);
    }
  });

  const models = Object.keys(apis).reduce(
    (accumulator, key) => {
      const value = apis[key];
      const { state, effects } = accumulator;
      // 浅复制
      const newState = { ...state };
      const newEffects = { ...effects };
      // 初始化state
      newState[key] = undefined;

      // 判断入参类型， 可以是string 或者 是 *function
      switch (typeof value) {
        case 'string': {
          // 如果是string 就生成一个名字相同的effect
          const services = params => request(value, params);
          newEffects[key] = function*({ payload, silence, errCatcher = true }, { call, put }) {
            // 根据payload 判断是否 有消息提示
            const showSuccessMsg = getIn(silence, ['success']);
            const showErrorMsg = getIn(silence, ['error']);

            try {
              // 错误处理和消息提示
              const response = yield call(services, payload);
              const { msg } = response;
              if (!(silence === true || showSuccessMsg) && message) message.success(msg);
              // 最后将整个response存入state
              yield put({
                type: 'save',
                payload: { [key]: response },
              });
              // 返回response
              return response;
            } catch (e) {
              if (!(silence === true || showErrorMsg) && message) message.error(e.message);
              if (errCatcher) {
                throw e;
              } else {
                console.error(e);
              }
            }
            return false;
          };

          break;
        }
        case 'function':
          // 如果是*function 则直接让*function 操作effects
          newEffects[key] = value;
          break;
        default:
          throw new Error(
            'only can support function and string, please checkout your params valid!',
          );
      }

      return {
        state: {
          ...state,
          ...newState,
        },
        effects: {
          ...effects,
          ...newEffects,
        },
      };
    },
    {
      state: store,
      effects: {},
    },
  );

  return {
    namespace,
    subscriptions,
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
      ...reducers,
    },
    ...models,
  };
};
