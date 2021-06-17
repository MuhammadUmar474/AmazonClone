import React, { useState, useEffect } from 'react'
import { Text, ScrollView, ActivityIndicator } from 'react-native'
import styles from './styles';
import product from '../../data/product';

import { DataStore, Auth } from 'aws-amplify';
import {Product, CartProduct} from '../../models';

import {Picker} from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import QuantitySelector from '../../components/QuantitySelector';
import Button from '../../components/Button';
import ImageCarousel from '../../components/ImageCarousel';

const ProductScreen = () => {

    const [product, setProduct] = useState<Product | undefined>(undefined);

    const [selectedOption, setSelectedOption] = useState<string | undefined>(
        undefined,
    );
    const [quantity, setQuantity] = useState(1);

    const navigation = useNavigation();
    const route = useRoute();

    useEffect(() => {
        if (!route.params?.id) {
          return;
        }
        DataStore.query(Product, route.params.id).then(setProduct);
      }, [route.params?.id]);

    useEffect(() => {
        if(product?.option){
            setSelectedOption(product.option[0])
        }
    }, [product])

    if (!product) {
        return <ActivityIndicator />;
      }

      const onAddToCart = async () => {
        const userData = await Auth.currentAuthenticatedUser();
    
        if (!product || !userData) {
          return;
        }
    
        const newCartProduct = new CartProduct({
          userSub: userData.attributes.sub,
          quantity,
          option: selectedOption,
          productID: product.id,
        });
    
        await DataStore.save(newCartProduct);
        navigation.navigate('ShoppingCart');
      };

    return (
        <ScrollView style={styles.root}>
            <Text style= {styles.title}>{product.title}</Text>

            {/* Image Carousal */}

            <ImageCarousel images={product.images}/>

            {/* Option Selector */}

            <Picker
            selectedValue={selectedOption}
            onValueChange={(itemValue) => 
                setSelectedOption(itemValue)}
            >
                {product.option.map(option => (<Picker.Item label={option} value={option} />))}
            </Picker>

            {/* Price */}

            <Text style={styles.price}>
                from ${product.price.toFixed(2)}
                { product.oldPrice &&  <Text style={styles.oldPrice}> ${product.oldPrice.toFixed(2)}</Text>}
            </Text>

            {/* Description */}

            <Text style={styles.description}>
                {product.description}
            </Text>

            {/* Quantity Selector */}
            <QuantitySelector quantity={quantity} setQuantity={setQuantity}/>

            {/* Button */}

            <Button text={'Add to Cart'} onPress={onAddToCart} />
            <Button text={'Buy Now'} onPress={() => {console.warn('Buy Now')}} />

        </ScrollView>
    )
}

export default ProductScreen;
