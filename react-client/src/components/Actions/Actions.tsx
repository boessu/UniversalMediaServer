/*
 * This file is part of Universal Media Server, based on PS3 Media Server.
 *
 * This program is a free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation; version 2 of the License only.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program; if not, write to the Free Software Foundation, Inc., 51
 * Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 */
import { Box, Button, Code, Group, List, Modal, ScrollArea, Stack, Text, Tooltip } from '@mantine/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconPower, IconRefresh, IconRefreshAlert, IconReport, IconDevicesPcOff } from '@tabler/icons-react';

import { havePermission, Permissions } from '../../services/accounts-service';
import { ActionsValues, sendAction } from '../../services/actions-service';
import { I18nInterface } from '../../services/i18n-service';
import { MainInterface } from '../../services/main-service';
import { SessionInterface } from '../../services/session-service';
import { actionsApiUrl, defaultTooltipSettings } from '../../utils';

const Actions = ({ i18n, main, session }: { i18n:I18nInterface, main:MainInterface, session:SessionInterface }) => {
  const canModify = havePermission(session, Permissions.settings_modify);
  const [actionsValues, setActionsValues] = useState<ActionsValues>({ canShutdownComputer: false });
  const navigate = useNavigate();

  const canRestartServer = havePermission(session, Permissions.server_restart);
  const [restartServerOpened, setRestartServerOpened] = useState(false);
  const restartServer = async () => {
    await sendAction('Server.Restart');
  };

  const canShutdownComputer = havePermission(session, Permissions.computer_shutdown);
  const [shutdownComputerOpened, setShutdownComputerOpened] = useState(false);
  const shutdownComputer = async () => {
    await sendAction('Computer.Shutdown');
  };

  const canRestartApplication = havePermission(session, Permissions.application_restart | Permissions.application_shutdown);
  const [restartApplicationOpened, setRestartApplicationOpened] = useState(false);
  const restartApplication = async () => {
    await sendAction('Process.Reboot');
  };

  const canShutdownApplication = havePermission(session, Permissions.application_shutdown);
  const [shutdownApplicationOpened, setShutdownApplicationOpened] = useState(false);
  const shutdownApplication = async () => {
    await sendAction('Process.Exit');
  };

  //set the document Title to Tools
  useEffect(() => {
    document.title="Universal Media Server - Tools";
    session.stopSse()
    session.stopPlayerSse()
    main.setNavbarValue(undefined)
  }, []);

  useEffect(() => {
    axios.get(actionsApiUrl)
      .then((response) => {
        setActionsValues(response.data);
      });
  }, []);

  return (
    <Box style={{ maxWidth: 1024 }} mx='auto'>
      {canRestartServer &&
        <Modal
          centered
          scrollAreaComponent={ScrollArea.Autosize}
          opened={restartServerOpened}
          onClose={() => setRestartServerOpened(false)}
          title={(<Text c='red'>{i18n.get('Warning')}</Text>)}
        >
          <Text fw={600}>{i18n.get('ThisRestartsMediaServices')}</Text>
          <List>
            <List.Item><Code>{i18n.get('NetworkConnectionsWillClosed')}</Code></List.Item>
          </List>
          <Text>{i18n.get('AreYouSureContinue')}</Text>
          <Group justify='flex-end' mt='md'>
            <Button onClick={() => setRestartServerOpened(false)}>{i18n.get('Cancel')}</Button>
            <Button color='red' onClick={() => { setRestartServerOpened(false); restartServer() }}>{i18n.get('Confirm')}</Button>
          </Group>
        </Modal>
      }
      {canRestartApplication &&
        <Modal
          centered
          scrollAreaComponent={ScrollArea.Autosize}
          opened={restartApplicationOpened}
          onClose={() => setRestartApplicationOpened(false)}
          title={<Text c='red'>{i18n.get('Warning')}</Text>}
        >
          <Text fw={600}>{i18n.get('ThisStopsRestartsApp')}</Text>
          <List>
            <List.Item><Code>{i18n.get('NetworkConnectionsWillClosed')}</Code></List.Item>
            <List.Item><Code>{i18n.get('YouWillTemporarilyNotAbleAccessServer')}</Code></List.Item>
          </List>
          <Text>{i18n.get('AreYouSureContinue')}</Text>
          <Group justify='flex-end' mt='md'>
            <Button onClick={() => setRestartApplicationOpened(false)}>{i18n.get('Cancel')}</Button>
            <Button color='red' onClick={() => { setRestartApplicationOpened(false); restartApplication() }}>{i18n.get('Confirm')}</Button>
          </Group>
        </Modal>
      }
      {canShutdownApplication &&
        <Modal
          centered
          scrollAreaComponent={ScrollArea.Autosize}
          opened={shutdownApplicationOpened}
          onClose={() => setShutdownApplicationOpened(false)}
          title={<Text c='red'>{i18n.get('Warning')}</Text>}
        >
          <Text fw={600}>{i18n.get('ThisClosesApp')}</Text>
          <List>
            <List.Item><Code>{i18n.get('NetworkConnectionsWillClosed')}</Code></List.Item>
            <List.Item><Code color='red'>{i18n.get('YouWillNotAbleAccessServer')}</Code></List.Item>
          </List>
          <Text>{i18n.get('AreYouSureContinue')}</Text>
          <Group justify='flex-end' mt='md'>
            <Button onClick={() => setShutdownApplicationOpened(false)}>{i18n.get('Cancel')}</Button>
            <Button color='red' onClick={() => { setShutdownApplicationOpened(false); shutdownApplication() }}>{i18n.get('Confirm')}</Button>
          </Group>
        </Modal>
      }
      {canShutdownComputer &&
        <Modal
          centered
          scrollAreaComponent={ScrollArea.Autosize}
          opened={shutdownComputerOpened}
          onClose={() => setShutdownComputerOpened(false)}
          title={(<Text c='red'>{i18n.get('Warning')}</Text>)}
        >
          <Text fw={600}>{i18n.get('ThisShutDownComputer')}</Text>
          <List>
            <List.Item><Code>{i18n.get('NetworkConnectionsWillClosed')}</Code></List.Item>
            <List.Item><Code color='red'>{i18n.get('YouWillNotAbleAccessServerOrComputer')}</Code></List.Item>
            {!actionsValues.canShutdownComputer && (
              <List.Item><Code color='orange'>{i18n.get('ShutDownComputerRequiresRoot')}</Code></List.Item>
            )}
          </List>
          <Text>{i18n.get('AreYouSureContinue')}</Text>
          <Group justify='flex-end' mt='md'>
            <Button onClick={() => setShutdownComputerOpened(false)}>{i18n.get('Cancel')}</Button>
            <Button color='red' onClick={() => { setShutdownComputerOpened(false); shutdownComputer() }}>{i18n.get('Confirm')}</Button>
          </Group>
        </Modal>
      }
      <Stack>
        {canModify && (
          <Button variant='default' leftSection={<IconReport />} onClick={() => { navigate('/logs'); }}>View Logs</Button>
        )}
        {canRestartServer && (
          <Tooltip label={i18n.get('ThisRestartsMediaServices')} {...defaultTooltipSettings}>
            <Button variant='default' leftSection={<IconRefresh />} onClick={() => { setRestartServerOpened(true) }}>{i18n.get('RestartServer')}</Button>
          </Tooltip>
        )}
        {canRestartApplication && (
          <Tooltip label={i18n.get('ThisStopsRestartsApp')} {...defaultTooltipSettings}>
            <Button variant='default' leftSection={<IconRefreshAlert />} onClick={() => { setRestartApplicationOpened(true) }}>{i18n.get('RestartApplication')}</Button>
          </Tooltip>
        )}
        {canShutdownApplication && (
          <Tooltip label={i18n.get('ThisClosesApp')} {...defaultTooltipSettings}>
            <Button variant='default' leftSection={<IconPower strokeWidth={3} color={'red'} />} onClick={() => { setShutdownApplicationOpened(true) }}>{i18n.get('ShutdownApplication')}</Button>
          </Tooltip>
        )}
        {canShutdownComputer && (
          <Tooltip label={i18n.get('ThisShutDownComputer')} {...defaultTooltipSettings}>
            <Button variant='default' leftSection={<IconDevicesPcOff strokeWidth={2} color={'red'} />} onClick={() => { setShutdownComputerOpened(true) }}>{i18n.get('ShutDownComputer')}</Button>
          </Tooltip>
        )}
      </Stack>
    </Box>
  );
};

export default Actions;
