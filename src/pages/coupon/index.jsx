import React, { useState } from 'react'
import { Text, View } from '@tarojs/components'
import CouponPopup from '../../components/coupon-popup'
import styles from './index.module.less'

function CouponPage() {
  const [popupVisible, setPopupVisible] = useState(false)

  return (
    <View className={styles.page}>
      <View className={styles.hero}>
        <Text className={styles.pageTitle}>优惠券页面</Text>
        <Text className={styles.pageDesc}>点击下面按钮，查看底部优惠中心弹窗。</Text>
        <View className={styles.openButton} onClick={() => setPopupVisible(true)}>
          <Text className={styles.openButtonText}>打开优惠中心</Text>
        </View>
      </View>

      <CouponPopup visible={popupVisible} onClose={() => setPopupVisible(false)} />
    </View>
  )
}

export default CouponPage
