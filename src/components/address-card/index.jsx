import React from 'react'
import { Text, View } from '@tarojs/components'
import styles from './index.module.less'

function TagList({ tags }) {
  return tags.map((tag, index) => (
    <Text className={`${styles.tag} ${index === 0 ? styles.primaryTag : styles.secondaryTag}`} key={`${tag}-${index}`}>
      {tag}
    </Text>
  ))
}

function AddressTitle({ item }) {
  return (
    <View className={styles.addressTitle}>
      <View className={styles.firstLine}>
        {!!item.tags.length && <View className={styles.leadingTags}><TagList tags={item.tags} /></View>}
        <Text className={styles.addressLine}>{item.firstLine}</Text>
      </View>
      {(item.secondLine || item.trailingTag) && (
        <View className={styles.secondLine}>
          <Text className={item.trailingTag ? styles.addressWithTrailingTag : styles.secondAddressLine}>{item.secondLine}</Text>
          {item.trailingTag && (
            <Text className={item.trailingTagType === 'time' ? styles.timeTag : `${styles.tag} ${styles.endTag}`}>
              {item.trailingTag}
            </Text>
          )}
        </View>
      )}
    </View>
  )
}

function AddressCard({ item, selected, onSelect }) {
  return (
    <View className={`${styles.addressItem} ${selected ? styles.selectedItem : ''}`} onClick={onSelect}>
      <View className={`${styles.selectMark} ${selected ? styles.selectedMark : ''}`}>
        {selected && <Text className={styles.check}>✓</Text>}
      </View>
      <View className={styles.addressInfo}>
        <AddressTitle item={item} />
        <View className={styles.contact}>
          <Text>{item.recipient}</Text>
          <Text className={styles.phone}>{item.phone}</Text>
        </View>
      </View>
      <Text className={styles.editIcon}>编辑</Text>
    </View>
  )
}

export default AddressCard