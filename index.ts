import {addPlugin} from 'react-native-flipper';
import type {MMKVInstance} from 'react-native-mmkv-storage';

type Data = {
  instanceID: string;
  mode: 'READ' | 'WRITE' | 'DELETE';
  key: string;
  type: 'array' | 'boolean' | 'number' | 'object' | 'string';
  value: unknown;
  time: string;
};

type NewValueEvent = {data: Data; newValue: unknown};
type DeleteItemEvent = {data: Data};

export default function mmkvFlipper(mmkv: MMKVInstance) {
  addPlugin({
    getId: () => 'react-native-mmkv-storage',
    runInBackground: () => true,
    onConnect(connection) {
      if (mmkv) {
        if (mmkv.transactions) {
          connection.send('supportStatus', {reason: null});

          //#region ARRAY
          mmkv.transactions.register('array', 'onread', (key, value) => {
            connection.send('newData', {
              instanceID: mmkv.instanceID,
              mode: 'READ',
              key,
              type: 'array',
              value,
              time: new Date().toISOString(),
            });
          });
          mmkv.transactions.register('array', 'onwrite', (key, value) => {
            connection.send('newData', {
              instanceID: mmkv.instanceID,
              mode: 'WRITE',
              key,
              type: 'array',
              value,
              time: new Date().toISOString(),
            });
          });
          mmkv.transactions.register('array', 'ondelete', (key, value) => {
            connection.send('newData', {
              instanceID: mmkv.instanceID,
              mode: 'DELETE',
              key,
              type: '',
              value,
              time: new Date().toISOString(),
            });
          });
          //#endregion

          //#region BOOLEAN
          mmkv.transactions.register('boolean', 'onread', (key, value) => {
            connection.send('newData', {
              instanceID: mmkv.instanceID,
              mode: 'READ',
              key,
              type: 'boolean',
              value,
              time: new Date().toISOString(),
            });
          });
          mmkv.transactions.register('boolean', 'onwrite', (key, value) => {
            connection.send('newData', {
              instanceID: mmkv.instanceID,
              mode: 'WRITE',
              key,
              type: 'boolean',
              value,
              time: new Date().toISOString(),
            });
          });
          mmkv.transactions.register('boolean', 'ondelete', (key, value) => {
            connection.send('newData', {
              instanceID: mmkv.instanceID,
              mode: 'DELETE',
              key,
              type: '',
              value,
              time: new Date().toISOString(),
            });
          });
          //#endregion

          //#region NUMBER
          mmkv.transactions.register('number', 'onread', (key, value) => {
            connection.send('newData', {
              instanceID: mmkv.instanceID,
              mode: 'READ',
              key,
              type: 'number',
              value,
              time: new Date().toISOString(),
            });
          });
          mmkv.transactions.register('number', 'onwrite', (key, value) => {
            connection.send('newData', {
              instanceID: mmkv.instanceID,
              mode: 'WRITE',
              key,
              type: 'number',
              value,
              time: new Date().toISOString(),
            });
          });
          mmkv.transactions.register('number', 'ondelete', (key, value) => {
            connection.send('newData', {
              instanceID: mmkv.instanceID,
              mode: 'DELETE',
              key,
              type: '',
              value,
              time: new Date().toISOString(),
            });
          });
          //#endregion

          //#region OBJECT
          mmkv.transactions.register('object', 'onread', (key, value) => {
            connection.send('newData', {
              instanceID: mmkv.instanceID,
              mode: 'READ',
              key,
              type: 'object',
              value,
              time: new Date().toISOString(),
            });
          });
          mmkv.transactions.register('object', 'onwrite', (key, value) => {
            connection.send('newData', {
              instanceID: mmkv.instanceID,
              mode: 'WRITE',
              key,
              type: 'object',
              value,
              time: new Date().toISOString(),
            });
          });
          mmkv.transactions.register('object', 'ondelete', (key, value) => {
            connection.send('newData', {
              instanceID: mmkv.instanceID,
              mode: 'DELETE',
              key,
              type: '',
              value,
              time: new Date().toISOString(),
            });
          });
          //#endregion

          //#region STRING
          mmkv.transactions.register('string', 'onread', (key, value) => {
            connection.send('newData', {
              instanceID: mmkv.instanceID,
              mode: 'READ',
              key,
              type: 'string',
              value,
              time: new Date().toISOString(),
            });
          });
          mmkv.transactions.register('string', 'onwrite', (key, value) => {
            connection.send('newData', {
              instanceID: mmkv.instanceID,
              mode: 'WRITE',
              key,
              type: 'string',
              value,
              time: new Date().toISOString(),
            });
          });
          mmkv.transactions.register('string', 'ondelete', (key, value) => {
            connection.send('newData', {
              instanceID: mmkv.instanceID,
              mode: 'DELETE',
              key,
              type: '',
              value,
              time: new Date().toISOString(),
            });
          });
          //#endregion

          connection.receive('editValue', (state: NewValueEvent, responder) => {
            if (state.data.instanceID === mmkv.instanceID) {
              switch (state.data.type) {
                case 'boolean':
                  mmkv.setBool(state.data.key, state.newValue as boolean);
                  break;
                case 'number':
                  mmkv.setInt(state.data.key, state.newValue as number);
                  break;
                case 'string':
                  mmkv.setString(state.data.key, state.newValue as string);
                  break;
                case 'array':
                  mmkv.setArray(state.data.key, state.newValue as unknown[]);
                  break;
                case 'object':
                  mmkv.setMap(
                    state.data.key,
                    state.newValue as Record<string, unknown>,
                  );
                  break;
                default:
                  break;
              }
              responder.success();
            } else {
              responder.error({reason: 'Mismatch instance ID'});
            }
          });
          connection.receive(
            'deleteItem',
            (state: DeleteItemEvent, responder) => {
              if (state.data.instanceID === mmkv.instanceID) {
                try {
                  mmkv.removeItem(state.data.key);
                } catch {
                  //
                }
                responder.success();
              } else {
                responder.error({reason: 'Mismatch instance ID'});
              }
            },
          );
        } else {
          connection.send('supportStatus', {
            reason:
              "You're using RN MMKV storage that don't have Transaction Manager. Please update to the latest version.",
          });
        }
      } else {
        connection.send('supportStatus', {
          reason: 'MMKV instance not found!',
        });
      }
    },
    onDisconnect() {
      try {
        mmkv.transactions.clear();
      } catch (error) {
        //
      }
    },
  });
}
