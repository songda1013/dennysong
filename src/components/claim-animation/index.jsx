import React from 'react'
import { Text, View } from '@tarojs/components'
import styles from './index.module.less'

/**
 * 领券动效层（滑入券条 + 4 张 ¥ 小券向左下飘落）
 * 纯展示组件，React.memo 隔离——页面 re-render 时不参与 diff
 *
 * @param {string} animPhase - idle | sliding | falling
 * @param {Array} fallParticles - 下落粒子配置
 * @param {{x:number,y:number}} animSource - 动画起点（相对 body 容器）
 * @param {number} fallDurationMs - 下落动画时长
 */
function ClaimAnimation({ animPhase, fallParticles, animSource, fallDurationMs }) {
  if (animPhase === 'idle') return null

  return (
    <View className={styles.animOverlay}>
      {/* Phase 1: 右→左滑入到被点击卡片中心，falling 阶段淡出 */}
      {(animPhase === 'sliding' || animPhase === 'falling') && (
        <View
          className={`${styles.slideStrip} ${animPhase === 'falling' ? styles.slideStripSplit : ''}`}
          style={{
            left: `${animSource.x}px`,
            top: `${animSource.y}px`
          }}
        >
          <View className={styles.slideInner}>
            <Text className={styles.slidePrice}>¥39.9</Text>
            <View className={styles.slideClaimBtn}>
              <Text className={styles.slideClaimText}>已领取</Text>
            </View>
          </View>
        </View>
      )}

      {/* Phase 2: 4 张券从被点击卡片中心向左下角落下 */}
      {animPhase === 'falling' && fallParticles.map((p) => (
        <View
          key={p.id}
          className={styles.fallCoupon}
          style={{
            left: `${animSource.x}px`,
            top: `${animSource.y}px`,
            '--init-x': `${p.initX}px`,
            '--left-dist': `${p.leftDist}px`,
            '--land-y': `${p.landY}px`,
            '--rotate': `${p.rotate}deg`,
            animationDelay: `${p.delay}ms`,
            animationDuration: `${fallDurationMs}ms`
          }}
        >
          <View className={styles.burstInner}>
            <Text className={styles.burstIcon}>¥</Text>
          </View>
        </View>
      ))}
    </View>
  )
}

export default React.memo(ClaimAnimation)
