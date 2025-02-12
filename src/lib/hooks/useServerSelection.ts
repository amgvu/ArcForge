import { useState } from 'react';
import { Server } from '@/types/types';
import { useServers } from '@/lib/hooks';

export const useServerSelection = () => {
  const { servers, error: serversError } = useServers();
  const [selectedServer, setSelectedServer] = useState('');
  const [selectedServerName, setSelectedServerName] = useState<string>('');

  const handleServerSelection = (value: string) => {
    const selected = servers.find((server: Server) => server.name === value);
    if (selected) {
      setSelectedServerName(selected.name);
      setSelectedServer(selected.id);
    } else {
      setSelectedServerName('');
      setSelectedServer('');
    }
  };

  return {
    servers,
    serversError,
    selectedServer,
    selectedServerName,
    handleServerSelection
  };
};