import React from 'react'
import { Text, View } from '@tarojs/components'
import ClaimButton from '../claim-button'
import styles from './index.module.less'

/**
 * 紧凑券包卡片（warm 风格，带徽标）
 * @param {object} item - 券数据
 * @param {boolean} isClaimed - 是否已领取
 * @param {function} onClaim - 领券回调 (item) => void
 */
function CompactCard({ item, isClaimed, onClaim }) {
  return (
    <View className={styles.compactInner}>
      <View className={styles.compactLeft}>
        <View className={styles.ticketBadge}>
          <Text className={styles.ticketBadgeText}>专享券包</Text>
        </View>
      </View>
      <View className={styles.compactContent}>
        <Text className={styles.compactTitle}>{item.title}</Text>
        <View className={styles.compactMeta}>
          <Text className={styles.compactDesc}>{item.desc}</Text>
          <View className={styles.compactDot} />
        </View>
      </View>
      <ClaimButton isClaimed={isClaimed} onClick={() => onClaim(item)} />
    </View>
  )
}

export default React.memo(CompactCard)
