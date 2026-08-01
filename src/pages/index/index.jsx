import React, { useState } from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import AddressCard from '../../components/address-card'
import styles from './index.module.less'

function Index() {
  const [selectedId, setSelectedId] = useState(5)

  const handleGoCoupon = () => {
    Taro.navigateTo({
      url: '/pages/coupon/index'
    })
  }

  return (
    <View className={styles.addressPage}>
      <View className={styles.addressList}>
        {addresses.map((item) => (
          <AddressCard
            item={item}
            key={item.id}
            selected={item.id === selectedId}
            onSelect={() => setSelectedId(item.id)}
          />
        ))}
      </View>
      <View className={styles.bottomBar}>
        <View className={styles.couponButton} onClick={handleGoCoupon}>
          去卡券页
        </View>
      </View>
    </View>
  )
}

const addresses = [
  { id: 1, tags: ['常用', '公司'], firstLine: '地址未超过一行展示', recipient: '张先生', phone: '112****3838' },
  { id: 2, tags: ['上次下单', '学校'], firstLine: '地址未超过一行展示', recipient: '张先生', phone: '11212343838' },
  { id: 3, tags: ['距离最近', '父母家'], firstLine: '城开YOYO联合办公 6楼', secondLine: '超过固定长度折行超过固定长度折行', trailingTag: '04:59 后暂停停止接单', trailingTagType: 'time', recipient: '张先生', phone: '112****3838' },
  { id: 4, tags: ['距离最近', '家'], firstLine: '一行固定宽度展示超出后折行', secondLine: '超过固定长度折行折行折行折行折阿萨大大', recipient: '张先生', phone: '112****3838' },
  { id: 5, tags: ['常用', '公司'], firstLine: '城开YOYO联合办公 6楼', recipient: '张先生', phone: '112****3838' },
  { id: 6, tags: [], firstLine: '一行固定宽度展示超出后折行文案文案文', secondLine: '超过固定长度折行折行折行折行大苏打的', trailingTag: '默认地址标签文字可变', trailingTagType: 'end', recipient: '张先生', phone: '112****3838' },
]

export default Index
