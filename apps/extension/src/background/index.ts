import browser from 'webextension-polyfill'

const handleZoomChange = (info: browser.Tabs.OnZoomChangeZoomChangeInfoType) => {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    const tab = tabs[0]
    if (tab.id === info.tabId) {
      browser.tabs
        .sendMessage(tab.id, {
          zoom: info.newZoomFactor,
        })
        .catch((err) => {
          console.warn(err)
        })
    }
  })
}

const makeRequest = async (endpoint: any, method='GET', data=null) => {
  try {
      const url = `${process.env.API_URL}/${endpoint}`;
      const response = await fetch(url, {
          method: method,
          headers: {
              'Content-Type': 'application/json',
          },
          body: data ? JSON.stringify(data) : null,
          mode: 'cors',
          // credentials: 'include',
      });
      console.log('response', response.status, response.body)
      if (!response.ok && response.status === 401) {
          return { error: 'Unauthorized' }
      } else if (!response.ok && response.status === 403) {
          return { error: 'Forbidden' }
      } else if (!response.ok && response.status === 404) {
        return { error: 'Not Found' }
      } else if (!response.ok && response.status === 400) {
        return { error: 'Wrong input' }
      } else if (!response.ok) {
        return { error: 'Something went wrong' }
      }
      const result = await response.json();
      return result;
  } catch (err) {
      // console.log(err);
      return { error: 'Something went wrong' };
  }
}

const handleMessage = async (message: any) => {
  if (message.type === 'zoom') {
    return browser.tabs.getZoom()
  } else {
    if (message.action === 'AUTH_CHECK') {
      return new Promise((resolve, _) => {
        makeRequest('api/auth/session')
        .then((data) => {
          if (Object.keys(data).length > 0) {
            resolve(data)
          } else {
            resolve( { error: 'Unauthorized' } )
          }
        })
        .catch(err => {
          resolve( { error: 'Unauthorized' } )
        });
      });
    } else if (message.action === 'ROUTE_CHECK') {
      return makeRequest('api/hello');
    } else if (message.action === 'SAVE_DOODLE') {
      return makeRequest('api/doodle/new', 'POST', message.data)
    } else if (message.action === 'GET_DOODLE_ID') {
      return makeRequest(`api/doodle/${message.data.doodleId}`)
    } else if (message.action === 'MY_DOODLE_ID_HASH') {
      return makeRequest(`api/doodle/hash/${message.data.siteHash}/me`)
    } else if (message.action === 'GET_DOODLE_HASH') {
      return makeRequest(`api/doodle/hash/${message.data.siteHash}`)
    } else if (message.action === 'UPDATE_DOODLE') {
      return makeRequest(`api/doodle/${message.data.doodleId}`, 'PATCH', message.data)
    } else if (message.action === 'UPDATE_DOODLE_STATE') {
      return makeRequest(`api/doodle/${message.data.doodleId}/author`, 'PATCH', message.data)
    } else if (message.action === 'GET_PERMISSIONS') {
      return makeRequest(`api/doodle/${message.data.doodleId}/permission`)
    } else if (message.action === 'ADD_PERMISSION') {
      return makeRequest(`api/doodle/${message.data.doodleId}/permission`, 'POST', message.data)
    } else if (message.action === 'DELETE_PERMISSION') {
      return makeRequest(`api/doodle/${message.data.doodleId}/permission`, 'DELETE', message.data)
    }
    return true;
  } 
}

browser.runtime.onMessage.addListener(handleMessage as any);

console.log("running background script");
// browser.tabs.onZoomChange.addListener(handleZoomChange)
