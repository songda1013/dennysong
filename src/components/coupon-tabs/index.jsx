import React from 'react'
import { Text, View } from '@tarojs/components'
import styles from './index.module.less'

/**
 * 优惠券中心顶部 Tab 栏
 * @param {string[]} tabs - 标签列表
 * @param {string} activeTab - 当前激活标签
 * @param {function} onChange - 切换回调 (tab) => void
 */
function CouponTabs({ tabs, activeTab, onChange }) {
  const activeIndex = tabs.indexOf(activeTab)

  return (
    <View className={styles.tabBar}>
      {tabs.map((tab) => {
        const active = tab === activeTab
        return (
          <View className={styles.tabItem} key={tab} onClick={() => onChange(tab)}>
            {tab === '领券' && <Text className={styles.badge}>气泡装饰</Text>}
            <Text className={`${styles.tabText} ${active ? styles.activeTabText : ''}`}>{tab}</Text>
          </View>
        )
      })}
      <View className={styles.tabIndicatorTrack}>
        <View
          className={styles.tabIndicatorSlot}
          style={{
            width: `${100 / tabs.length}%`,
            transform: `translateX(${activeIndex * 100}%)`
          }}
        >
          <View className={styles.tabIndicator} />
        </View>
      </View>
    </View>
  )
}

export default React.memo(CouponTabs)
