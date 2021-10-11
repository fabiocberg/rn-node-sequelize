import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function App() {

  const [produtos, setProdutos] = useState<any[]>([])

  const [novoNome, setNovoNome] = useState('')
  const [novaQuantidade, setNovaQuantidade] = useState('')

  const [produto, setProduto] = useState<any>(null)

  const getItems = () => {
    fetch('http://localhost:3333/produtos', {
      method: 'GET'
    }).then(response => response.json())
    .then(response => {
      setProdutos(response.produtos)
    })
  }

  useEffect(() => {
    getItems()
  }, [])

  const addItem = () => {
    if (novoNome.trim().length > 0) {
      const data = {
        nome: novoNome,
        quantidade: novaQuantidade,
      }
      console.log(data)
      setNovoNome('')
      setNovaQuantidade('')
      fetch('http://localhost:3333/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }).then(() => {
        console.log('OK')
        getItems()
      })
    }
  }

  const save = () => {
    const data = {
      id: produto.id,
      quantidade: novaQuantidade,
    }
    setNovaQuantidade('')
    setProduto(null)
    fetch('http://localhost:3333/produtos', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }).then(() => {
      console.log('OK')
      getItems()
    })
  }

  const edit = (item: any) => {
    setNovoNome('')
    setNovaQuantidade('')
    setProduto(item)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <TextInput style={[styles.input, {width: '50%'}]} 
          value={novoNome} onChangeText={text => setNovoNome(text)}
        />
        <TextInput style={[styles.input, {width: '25%'}]} 
          value={novaQuantidade} onChangeText={text => setNovaQuantidade(text)}
        />
        <TouchableOpacity style={[styles.button, {width: '25%'}]} onPress={addItem}>
          <Text>Adicionar</Text>
        </TouchableOpacity>
      </View>
      <FlatList data={produtos} keyExtractor={item => `${item.id}`} renderItem={({item}) => {
        return (
          <TouchableOpacity style={styles.itemLine} onPress={() => edit(item)}>
            <Text>{item.nome}</Text><Text>{item.quantidade}</Text>
          </TouchableOpacity>
        )
      }} />
      
      <Modal animationType='slide'
        transparent={true}
        visible={produto != null}
        
      >
        <View style={styles.centeredView}>
          <View style={styles.modalBody}>
            <TextInput style={[styles.input, {width: 100, marginBottom: 8}]} value={novaQuantidade} onChangeText={text => setNovaQuantidade(text)} />
            <TouchableOpacity style={[styles.button, {marginBottom: 8}]} onPress={save}>
              <Text>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setProduto(null)}>
              <Text>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    backgroundColor: '#fff',
    borderColor: '#777',
    borderWidth: 1,
    borderRadius: 8,
    padding: 20,
    alignItems: 'center'
  },
  form: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
  },
  input: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
  }
});
