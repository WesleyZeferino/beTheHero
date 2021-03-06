import React, {useEffect, useState} from "react";
import { FlatList, View, Text, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";

import logo from '../../assets/logo.png'
import styles from './styles'
import api from "../../services/api";

export default function Incidents() {
  const navigation = useNavigation()
  const [incidents, setIncidents] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  async function loadIncidents() {
    if (loading || (total > 0 && incidents.length === total)) {
      return
    }

    setLoading(true)

    const resp = await api.get('/incidents', {
      params: {page}
    })
    setIncidents([...incidents, ...resp.data])
    setTotal(resp.headers['x-total-count'])
    setPage(page+1)
    setLoading(false)
  }

  useEffect(() => {
    loadIncidents()
  }, [])

  function navigateToDetail(incident) {
    navigation.navigate('Detail', {incident})
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} />
        <Text style={styles.headerText}>Total de <Text style={styles.headerTextBold}>{total} casos</Text></Text>
      </View>

      <Text style={styles.title}>Bem-vindo!</Text>
      <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia</Text>

      <FlatList 
        data={incidents}
        style={styles.incidentList}
        keyExtractor={incident => String(incident.id)}
        showsVerticalScrollIndicator={true}
        onEndReached={loadIncidents}
        onEndReachedThreshold={0.2}
        renderItem={({item}) => (
          <View style={styles.incident}>
            <Text style={styles.incidentProperty}>ONG:</Text>
            <Text style={styles.incidentValue}>{item.name}</Text>

            <Text style={styles.incidentProperty}>CASO:</Text>
            <Text style={styles.incidentValue}>{item.title}</Text>

            <Text style={styles.incidentProperty}>VALOR:</Text>
            <Text style={styles.incidentValue}>
              {
                Intl.NumberFormat('pt-BR', {
                  style: 'currency', currency: 'BRL'
                }).format(item.value)
              }
            </Text>

            <TouchableOpacity onPress={() => navigateToDetail(item)} style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
              <Feather name="arrow-right" size={16} color="#E02041" />
            </TouchableOpacity>
          </View>    
        )}/>
    </View>
  )
}