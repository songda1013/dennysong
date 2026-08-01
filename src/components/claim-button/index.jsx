import React from 'react'
import { Text, View } from '@tarojs/components'
import styles from './index.module.less'

/**
 * 共享领券按钮
 * @param {boolean} isClaimed - 是否已领取
 * @param {function} onClick - 点击回调（已领取时不触发）
 */
function ClaimButton({ isClaimed, onClick }) {
  return (
    <View
      className={`${styles.claimButton} ${isClaimed ? styles.claimButtonDone : ''}`}
      onClick={isClaimed ? undefined : onClick}
    >
      <Text className={styles.claimButtonText}>{isClaimed ? '已领' : '领券'}</Text>
    </View>
  )
}

export default React.memo(ClaimButton)
