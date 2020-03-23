/**
 * central state store powered by subx - https://github.com/tylerlong/subx
 */

import Subx from '@electerm/subx'
import initState from './init-state'
import loadDataExtend from './load-data'
import dbUpgradeExtend from './db-upgrade'
import eventExtend from './event'
import syncExtend from './sync'
import appUpgrdeExtend from './app-upgrade'
import bookmarkGroupExtend from './bookmark-group'
import bookmarkExtend from './bookmark'
import commonExtend from './common'
import contextMenuExtend from './context-menu'
import itemExtend from './item'
import quickCommandExtend from './quick-command'
import sessionExtend from './session'
import settingExtend from './setting'
import sidebarExtend from './sidebar'
import sysMenuExtend from './system-menu'
import tabExtend from './tab'
import terminalThemeExtend from './terminal-theme'
import transferHistoryExtend from './transfer-history'

import _ from 'lodash'
import copy from 'json-deep-copy'
import {
  terminalSshConfigType,
  settingMap
} from '../common/constants'
import getInitItem from '../common/init-setting-item'
const { getGlobal } = window
const sshConfigItems = copy(getGlobal('sshConfigItems'))

const store = Subx.create({
  ...initState,
  get currentQuickCommands () {
    const { currentTab, quickCommands } = store
    const currentTabQuickCommands = _.get(
      currentTab, 'quickCommands'
    ) || []
    return [
      ...currentTabQuickCommands,
      ...copy(quickCommands)
    ]
  },
  get isTransporting () {
    return store.tabs.some(t => t.isTransporting)
  },
  get settingSidebarList () {
    const {
      tab
    } = store
    const arr = store.getItems(tab)
    const initItem = getInitItem(arr, tab)
    return tab === settingMap.history
      ? arr
      : [
        copy(initItem),
        ...arr
      ]
  },
  get tabTitles () {
    return store.tabs.map(d => d.title).join('#')
  },
  get currentTab () {
    const tabs = copy(store.tabs)
    return _.find(tabs, tab => {
      return tab.id === store.currentTabId
    })
  },
  get bookmarkGroupsTotal () {
    return store.sshConfigItems.length
      ? [
        ...store.bookmarkGroups,
        {
          title: terminalSshConfigType,
          id: terminalSshConfigType,
          bookmarkIds: sshConfigItems.map(d => d.id)
        }
      ]
      : store.bookmarkGroups
  }
})

loadDataExtend(store)
eventExtend(store)
dbUpgradeExtend(store)
syncExtend(store)
appUpgrdeExtend(store)
bookmarkGroupExtend(store)
bookmarkExtend(store)
commonExtend(store)
contextMenuExtend(store)
itemExtend(store)
quickCommandExtend(store)
sessionExtend(store)
settingExtend(store)
sidebarExtend(store)
sysMenuExtend(store)
tabExtend(store)
terminalThemeExtend(store)
transferHistoryExtend(store)

export default store
