// src/screens/app/CampaignsScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';
import { campaignService } from '../../services/firebase';
import { Campaign } from '../../types';
import { COLORS } from '../../utils/constants';


type CampaignsScreenNavigationProp = NativeStackNavigationProp<any, 'Campaigns'>;

interface Props {
  navigation: CampaignsScreenNavigationProp;
}

export default function CampaignsScreen({ navigation }: Props) {
  const { user, signOut } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Buscar campanhas ao carregar a tela
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const data = await campaignService.getAllCampaigns();
      setCampaigns(data);
    } catch (error: any) {
      console.error('Erro ao buscar campanhas:', error);
      Alert.alert(
        'Erro',
        'Não foi possível carregar as campanhas. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCampaigns();
    setRefreshing(false);
  }, []);

  // Navegar para detalhes da campanha
  const handleCampaignPress = (campaign: Campaign) => {
    navigation.navigate('CampaignDetails', { campaignId: campaign._id });
  };

  // Renderizar cada item da campanha
  const renderCampaignItem = ({ item }: { item: Campaign }) => (
    <TouchableOpacity
      style={styles.campaignButton}
      onPress={() => handleCampaignPress(item)}
      activeOpacity={0.8}
    >
      <Text style={styles.campaignButtonText}>{item.nome}</Text>
    </TouchableOpacity>
  );

  // Obter saudação baseada na hora do dia
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <View style={styles.container}>
      {/* Header com Logo e Saudação */}
      <View style={styles.header}>
        <Image width={50} height={50} />
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>
            {getGreeting()}, {user?.nome.split(' ')[0]}! 👋
          </Text>
        </View>
      </View>

      {/* Título */}
      <Text style={styles.title}>Campanhas ativas:</Text>

      {/* Lista de Campanhas */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Carregando campanhas...</Text>
        </View>
      ) : campaigns.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma campanha encontrada</Text>
          <Text style={styles.emptySubtext}>
            Crie uma nova campanha para começar
          </Text>
        </View>
      ) : (
        <FlatList
          data={campaigns}
          renderItem={renderCampaignItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Botão Sair */}
      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutButtonText}>🚪 Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  greetingContainer: {
    marginTop: 15,
  },
  greetingText: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: '500',
  },
  title: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
  campaignButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  campaignButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
