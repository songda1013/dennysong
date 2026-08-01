import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import CouponTabs from '../coupon-tabs'
import CouponCard from '../coupon-card'
import CompactCard from '../compact-card'
import ClaimAnimation from '../claim-animation'
import {
  POPUP_TRANSITION_MS,
  SLIDE_DURATION_MS,
  FALL_DURATION_MS,
  HIGHLIGHT_DURATION_MS,
  BURST_COUNT,
  PARTICLE_DELAY_MS,
  tabs,
  couponCards
} from '../../pages/coupon/constants'
import styles from './index.module.less'

/**
 * 优惠中心底部弹窗容器
 * 内聚弹窗显隐过渡、Tab 切换、领券动效、已领状态
 *
 * @param {boolean} visible - 是否展示（受控）
 * @param {function} onClose - 请求关闭回调
 * @param {Array} cards - 券列表数据（默认取 constants.couponCards）
 */
function CouponPopup({ visible, onClose, cards }) {
  const sourceCards = useMemo(() => cards || couponCards, [cards])

  const [mounted, setMounted] = useState(false)
  const [popupActive, setPopupActive] = useState(false)
  const [activeTab, setActiveTab] = useState('领券')

  const [claimedIds, setClaimedIds] = useState({})
  const [highlightIds, setHighlightIds] = useState({})

  // 三段式动效状态
  const [animPhase, setAnimPhase] = useState('idle') // idle | sliding | falling
  const [fallParticles, setFallParticles] = useState([])
  const [animSource, setAnimSource] = useState({ x: 0, y: 0 })

  const transitionTimerRef = useRef(null)
  const highlightTimerRef = useRef(null)
  const animTimerRef = useRef(null)
  const bodyWrapRectRef = useRef(null)

  const activeCoupons = useMemo(() => sourceCards, [sourceCards])

  // 卸载时清理所有定时器
  useEffect(() => () => {
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)
    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current)
    if (animTimerRef.current) clearTimeout(animTimerRef.current)
  }, [])

  // 受控 visible → 内部 mounted/popupActive 过渡
  useEffect(() => {
    if (visible) {
      setMounted(true)
      transitionTimerRef.current = setTimeout(() => {
        setPopupActive(true)
        transitionTimerRef.current = null
      }, 16)
      return () => {
        if (transitionTimerRef.current) {
          clearTimeout(transitionTimerRef.current)
          transitionTimerRef.current = null
        }
      }
    }
    if (mounted) {
      setPopupActive(false)
      transitionTimerRef.current = setTimeout(() => {
        setMounted(false)
        transitionTimerRef.current = null
      }, POPUP_TRANSITION_MS)
      return () => {
        if (transitionTimerRef.current) {
          clearTimeout(transitionTimerRef.current)
          transitionTimerRef.current = null
        }
      }
    }
  }, [visible])

  // 弹窗打开后查询 body 容器位置
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        Taro.createSelectorQuery()
          .select('#js-popup-body-wrap').boundingClientRect()
          .exec((res) => {
            bodyWrapRectRef.current = res[0] || null
          })
      }, 350)
      return () => clearTimeout(timer)
    }
  }, [visible])

  const closePopup = () => {
    onClose && onClose()
  }

  // 核心：滑入→直接下落
  const startClaimAnimation = useCallback((claimedItems, sourceX, sourceY) => {
    setAnimSource({ x: sourceX, y: sourceY })
    setAnimPhase('sliding')

    animTimerRef.current = setTimeout(() => {
      const particles = []
      for (let i = 0; i < BURST_COUNT; i++) {
        particles.push({
          id: `fall-${Date.now()}-${i}`,
          initX: (i - 1.5) * 34,
          leftDist: 155 + Math.random() * 20,
          landY: 160 + i * 62,
          rotate: (Math.random() * 60 - 30),
          delay: i * 80
        })
      }
      setFallParticles(particles)
      setAnimPhase('falling')

      const settleMs = FALL_DURATION_MS + (BURST_COUNT - 1) * PARTICLE_DELAY_MS + 200
      animTimerRef.current = setTimeout(() => {
        const newClaimed = {}
        claimedItems.forEach(c => { newClaimed[c.id] = true })
        setClaimedIds(prev => ({ ...prev, ...newClaimed }))
        setHighlightIds(newClaimed)
        setAnimPhase('idle')
        setFallParticles([])

        Taro.showToast({
          title: `成功领取${claimedItems.length}张券`,
          icon: 'success',
          duration: HIGHLIGHT_DURATION_MS
        })

        highlightTimerRef.current = setTimeout(() => {
          setHighlightIds({})
          highlightTimerRef.current = null
        }, HIGHLIGHT_DURATION_MS)

        animTimerRef.current = null
      }, settleMs)
    }, SLIDE_DURATION_MS)
  }, [])

  const handleSingleClaim = useCallback((item) => {
    if (claimedIds[item.id] || animPhase !== 'idle') return

    const query = Taro.createSelectorQuery()
    query.select('#js-popup-body-wrap').boundingClientRect()
    query.select(`#card-${item.id}`).boundingClientRect()
    query.exec((res) => {
      const wrapRect = res[0]
      const cardRect = res[1]
      let sourceX = 0
      let sourceY = 0
      if (cardRect && wrapRect) {
        sourceX = cardRect.left + cardRect.width / 2 - wrapRect.left
        sourceY = cardRect.top + cardRect.height / 2 - wrapRect.top
      }
      startClaimAnimation([item], sourceX, sourceY)
    })
  }, [claimedIds, animPhase, startClaimAnimation])

  // 稳定回调：ref 桥接最新 handler，引用永不变 → 卡片 memo 生效
  const claimHandlerRef = useRef(handleSingleClaim)
  claimHandlerRef.current = handleSingleClaim
  const stableClaimHandler = useCallback((item) => {
    claimHandlerRef.current(item)
  }, [])

  const handleBatchClaim = useCallback(() => {
    if (animPhase !== 'idle') return

    const pool = sourceCards.filter(c => !claimedIds[c.id])
    if (pool.length === 0) return

    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, BURST_COUNT)

    const query = Taro.createSelectorQuery()
    query.select('#js-popup-body-wrap').boundingClientRect()
    query.select(`#card-${selected[0].id}`).boundingClientRect()
    query.exec((res) => {
      const wrapRect = res[0]
      const cardRect = res[1]
      let sourceX = 0
      let sourceY = 0
      if (cardRect && wrapRect) {
        sourceX = cardRect.left + cardRect.width / 2 - wrapRect.left
        sourceY = cardRect.top + cardRect.height / 2 - wrapRect.top
      }
      startClaimAnimation(selected, sourceX, sourceY)
    })
  }, [claimedIds, animPhase, sourceCards, startClaimAnimation])

  if (!mounted) return null

  return (
    <View className={`${styles.overlay} ${popupActive ? styles.overlayVisible : ''}`} onClick={closePopup}>
      <View className={`${styles.popup} ${popupActive ? styles.popupVisible : ''}`} onClick={(event) => event.stopPropagation()}>
        <View className={styles.popupHeader}>
          <View className={styles.grabHandle} />
          <Text className={styles.popupTitle}>优惠中心</Text>
          <View className={styles.closeButton} onClick={closePopup}>
            <Text className={styles.closeIcon}>×</Text>
          </View>
        </View>

        <CouponTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <View id="js-popup-body-wrap" className={styles.popupBodyWrap}>
          <ScrollView scrollY className={styles.popupBody}>
            {activeCoupons.map((item) => {
              const isClaimed = !!claimedIds[item.id]
              const isHighlight = !!highlightIds[item.id]
              const cardClass = [
                styles.card,
                item.compact ? styles.compactCard : '',
                item.accent === 'warm' ? styles.warmCard : '',
                isClaimed ? styles.claimedCard : '',
                isHighlight ? styles.highlightCard : ''
              ].filter(Boolean).join(' ')

              return (
                <View id={`card-${item.id}`} className={cardClass} key={item.id}>
                  {item.compact
                    ? <CompactCard item={item} isClaimed={isClaimed} onClaim={stableClaimHandler} />
                    : <CouponCard item={item} isClaimed={isClaimed} onClaim={stableClaimHandler} />
                  }
                </View>
              )
            })}
          </ScrollView>

          <ClaimAnimation
            animPhase={animPhase}
            fallParticles={fallParticles}
            animSource={animSource}
            fallDurationMs={FALL_DURATION_MS}
          />
        </View>

        <View className={styles.footer}>
          <View className={styles.footerButton} onClick={handleBatchClaim}>
            <Text className={styles.footerButtonText}>一键领券</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default React.memo(CouponPopup)
