import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import ProductItem from '../../components/ProductItem';
import Products from '../../data/product';
import products from '../../data/products';

const HomeScreen = () => {
  return (
    <View style={styles.page}>
      {/* Render Root Component */}
      <FlatList 
      data={products}
      renderItem={({item}) => <ProductItem item={item}/>}
      showsVerticalScrollIndicator={false}
      />
     </View>
  );
}

const styles = StyleSheet.create({
    page:{
        padding: 10,
    },
});

export default HomeScreen;
