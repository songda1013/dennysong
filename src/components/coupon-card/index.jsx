import React from 'react'
import { Text, View } from '@tarojs/components'
import ClaimButton from '../claim-button'
import styles from './index.module.less'

/**
 * 标准优惠券卡片（带封面/标签/价格/规则）
 * @param {object} item - 券数据
 * @param {boolean} isClaimed - 是否已领取
 * @param {function} onClaim - 领券回调 (item) => void
 */
function CouponCard({ item, isClaimed, onClaim }) {
  return (
    <>
      {item.tags && (
        <View className={styles.ribbonRow}>
          <Text className={`${styles.ribbon} ${styles.redRibbon}`}>{item.tags[0]}</Text>
          {item.tags[1] ? <Text className={`${styles.ribbon} ${styles.goldRibbon}`}>{item.tags[1]}</Text> : null}
        </View>
      )}
      <View className={styles.cardMain}>
        <View className={styles.coverPlaceholder}>
          <View className={styles.coverDot} />
          <View className={styles.coverMountain} />
        </View>
        <View className={styles.cardContent}>
          <Text className={styles.cardTitle}>{item.title}</Text>
          {item.note && <Text className={styles.cardNote}>{item.note}</Text>}
          <Text className={styles.price}>{item.price}</Text>
          <Text className={styles.period}>{item.period}</Text>
        </View>
        <ClaimButton isClaimed={isClaimed} onClick={() => onClaim(item)} />
      </View>
      <View className={styles.cardDivider} />
      <View className={styles.cardBottom}>
        <Text className={styles.rules}>规则说明</Text>
        <Text className={styles.chevron}>›</Text>
      </View>
    </>
  )
}

export default React.memo(CouponCard)
