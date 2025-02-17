import React from 'react';
import { Avatar, Text, Stack, Box, Title, Card, List, ThemeIcon, Loader } from '@mantine/core';
import axios from 'axios';
import { IconCircleCheck } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useStores } from '../../logic/Providers/StoreProviders';
import { Spinner } from '../../components/Spinner';
import { observer } from 'mobx-react-lite';
import { ProfileTabs } from './Tabs';

const getInitials = (name: string | undefined) => {
  if (!name) return '';
  return name.substring(0, 2).toUpperCase();
};


export const UserProfile: React.FC = observer(() => {

  const {profileStore} = useStores();

  useEffect(() => {
    const fetchProfile = async () => {
        await profileStore.getProfile()
    }
    fetchProfile();
  }, []);

  if (profileStore.isLoading === true) {
    return <Spinner/>
  } else {
    return (
      <>
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: '100%', marginTop: '10px' }}>
            <Stack gap={8} align="center">
            <Avatar size={50} radius="xl" color='blue'>{getInitials(profileStore.user?.profile?.user_name)}</Avatar>
            <Title order={3}>{profileStore.user?.profile?.user_name}</Title>
            <Text color="dimmed">{profileStore.user?.profile?.mail_id}</Text>
            </Stack>

            <Box
            mt="xl"
            p="md"
            style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              textAlign: 'center',
            }}
            >
            <Text size="lg" fw={700} color="blue">
              Credits: {profileStore.user?.profile?.credits}
            </Text>
            <Text size="md" fw={500} color="gray">
              Rating: { profileStore.user?.profile?.rating }
            </Text>
            </Box>
            <div style={{ marginTop: '20px' }}>
            <ProfileTabs />
            </div>
        </Card>
       
      </>
    );
  }





});

export default UserProfile;