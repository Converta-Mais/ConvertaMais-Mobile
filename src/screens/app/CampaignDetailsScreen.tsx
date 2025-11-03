// src/screens/app/CampaignDetailsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { campaignService } from '../../services/campaignService';
import { Campaign } from '../../types/types';
import { COLORS } from '../../utils/constants';
import { AppStackParamList } from '../../navigation/AppStack';

type CampaignDetailsScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'CampaignDetails'
>;

type CampaignDetailsScreenRouteProp = RouteProp<AppStackParamList, 'CampaignDetails'>;

interface Props {
  navigation: CampaignDetailsScreenNavigationProp;
  route: CampaignDetailsScreenRouteProp;
}

export default function CampaignDetailsScreen({ navigation, route }: Props) {
  const { campaignId } = route.params;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaignDetails();
  }, []);

  const fetchCampaignDetails = async () => {
    try {
      const data = await campaignService.getCampaignById(campaignId);
      setCampaign(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da campanha');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{campaign?.nome}</Text>
        
        {campaign?.descricao && (
          <Text style={styles.description}>{campaign.descricao}</Text>
        )}

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text style={[styles.infoValue, styles.statusBadge]}>
              {campaign?.status}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total de Leads:</Text>
            <Text style={styles.infoValue}>{campaign?.totalLeads || 0}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Data de Início:</Text>
            <Text style={styles.infoValue}>
              {campaign?.dataInicio
                ? new Date(campaign.dataInicio).toLocaleDateString('pt-BR')
                : 'N/A'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 25,
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: COLORS.primary,
    color: COLORS.black,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
