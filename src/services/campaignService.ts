// src/services/campaignService.ts
import {
    collection,
    getDocs,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    DocumentData,
  } from 'firebase/firestore';
  import { firestore } from './firebase';
  import { Campaign } from '../types/types';
  
  const campaignsCollection = collection(firestore, 'campaigns');
  
  export const campaignService = {
    // Buscar todas campanhas
    getAllCampaigns: async (): Promise<Campaign[]> => {
      const querySnapshot = await getDocs(campaignsCollection);
      const campaigns: Campaign[] = [];
      querySnapshot.forEach((doc) => {
        campaigns.push({ _id: doc.id, ...doc.data() } as Campaign);
      });
      return campaigns;
    },
  
    // Buscar campanha por ID
    getCampaignById: async (id: string): Promise<Campaign | null> => {
      const docRef = doc(firestore, 'campaigns', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { _id: docSnap.id, ...docSnap.data() } as Campaign;
      }
      return null;
    },
  
    // Criar nova campanha (id será gerado automaticamente)
    createCampaign: async (campaign: Omit<Campaign, '_id'>): Promise<void> => {
      const newDocRef = doc(campaignsCollection);
      await setDoc(newDocRef, campaign as DocumentData);
    },
  
    // Atualizar campanha por ID (passar campos a atualizar)
    updateCampaign: async (id: string, updatedFields: Partial<Campaign>): Promise<void> => {
      const docRef = doc(firestore, 'campaigns', id);
      await updateDoc(docRef, updatedFields as DocumentData);
    },
  
    // Deletar campanha por ID
    deleteCampaign: async (id: string): Promise<void> => {
      const docRef = doc(firestore, 'campaigns', id);
      await deleteDoc(docRef);
    },
  };
  