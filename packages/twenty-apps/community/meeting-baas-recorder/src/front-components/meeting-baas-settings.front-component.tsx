import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { defineFrontComponent } from 'twenty-sdk';
import { Callout, H2Title, Status, themeCssVariables } from 'twenty-sdk/ui';

type RecordingPreference = 'RECORD_ALL' | 'RECORD_ORGANIZED' | 'RECORD_NONE';

type WorkspaceMember = {
  id: string;
  recordingPreference?: RecordingPreference;
  botName?: string;
  botEntryMessage?: string;
};

type CalendarChannel = {
  id: string;
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  width: 100%;
`;

const StyledCard = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledIconContainer = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.tertiary};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.secondary};
  display: flex;
  flex-shrink: 0;
  height: 40px;
  justify-content: center;
  width: 40px;
`;

const StyledTextContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const StyledTitle = styled.span`
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledDescription = styled.span`
  color: ${themeCssVariables.font.color.tertiary};
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledRadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledRadioLabel = styled.label<{ selected: boolean }>`
  align-items: center;
  background: ${({ selected }) =>
    selected ? themeCssVariables.accent.accent1 : themeCssVariables.background.primary};
  border: 1px solid
    ${({ selected }) =>
      selected ? themeCssVariables.accent.primary : themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  cursor: pointer;
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
  transition: all 0.15s ease;

  &:hover {
    border-color: ${themeCssVariables.accent.primary};
  }
`;

const StyledRadioInput = styled.input`
  accent-color: ${themeCssVariables.accent.primary};
  cursor: pointer;
  height: 16px;
  margin: 0;
  width: 16px;
`;

const StyledRadioTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StyledRadioTitle = styled.span`
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledRadioDescription = styled.span`
  color: ${themeCssVariables.font.color.tertiary};
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.xs};
`;

const StyledFieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledFieldLabel = styled.label`
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledTextInput = styled.input`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.md};
  margin-top: 4px;
  outline: none;
  padding: 10px 12px;
  width: 100%;

  &:focus {
    border-color: ${themeCssVariables.accent.primary};
  }

  &::placeholder {
    color: ${themeCssVariables.font.color.light};
  }
`;

const StyledCharCount = styled.span<{ over: boolean }>`
  color: ${({ over }) =>
    over ? themeCssVariables.color.red : themeCssVariables.font.color.tertiary};
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.xxs};
  margin-top: 2px;
  text-align: right;
`;

const PREFERENCE_OPTIONS: Array<{
  value: RecordingPreference;
  title: string;
  description: string;
}> = [
  {
    value: 'RECORD_ALL',
    title: 'Record all meetings',
    description: 'Automatically record every meeting with a conference link',
  },
  {
    value: 'RECORD_ORGANIZED',
    title: 'Organizer only',
    description: 'Only record meetings you organized',
  },
  {
    value: 'RECORD_NONE',
    title: 'Do not record',
    description: 'No automatic recording — you can still record manually',
  },
];

const fetchCurrentWorkspaceMember = async (): Promise<WorkspaceMember> => {
  const response = await fetch(`${process.env.TWENTY_API_URL}/rest/currentWorkspaceMember`, {
    headers: { Authorization: `Bearer ${process.env.TWENTY_API_KEY}` },
  });
  const data = await response.json();
  return data?.data ?? data;
};

const updateWorkspaceMember = async (
  memberId: string,
  fields: {
    recordingPreference?: RecordingPreference;
    botName?: string | null;
    botEntryMessage?: string | null;
  },
): Promise<void> => {
  const response = await fetch(`${process.env.TWENTY_API_URL}/rest/workspaceMembers/${memberId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${process.env.TWENTY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fields),
  });
  if (!response.ok) {
    throw new Error(`PATCH failed: ${response.status}`);
  }
};

const fetchCalendarChannels = async (): Promise<CalendarChannel[]> => {
  const response = await fetch(`${process.env.TWENTY_API_URL}/rest/calendarChannels?limit=1`, {
    headers: { Authorization: `Bearer ${process.env.TWENTY_API_KEY}` },
  });
  const data = await response.json();
  return data?.data?.calendarChannels ?? [];
};

const MeetingBaasSettings = () => {
  const [member, setMember] = useState<WorkspaceMember | null>(null);
  const [preference, setPreference] = useState<RecordingPreference>('RECORD_NONE');
  const [botName, setBotName] = useState('');
  const [botEntryMessage, setBotEntryMessage] = useState('');
  const [hasCalendar, setHasCalendar] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const apiKeyConfigured = Boolean(process.env.MEETING_BAAS_API_KEY);

  useEffect(() => {
    Promise.all([fetchCurrentWorkspaceMember(), fetchCalendarChannels()])
      .then(([memberData, channels]) => {
        setMember(memberData);
        setPreference(memberData.recordingPreference ?? 'RECORD_NONE');
        setBotName(memberData.botName ?? '');
        setBotEntryMessage(memberData.botEntryMessage ?? '');
        setHasCalendar(channels.length > 0);
      })
      .catch(() => {
        // Non-fatal: show defaults
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handlePreferenceChange = async (newPreference: RecordingPreference) => {
    if (!member || isSaving) return;
    const previousPreference = preference;
    setIsSaving(true);
    setPreference(newPreference);
    try {
      await updateWorkspaceMember(member.id, { recordingPreference: newPreference });
      setMember({ ...member, recordingPreference: newPreference });
    } catch {
      setPreference(previousPreference);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBotNameBlur = async () => {
    if (!member || isSaving) return;
    const trimmed = botName.trim();
    if (trimmed === (member.botName ?? '')) return;
    setIsSaving(true);
    try {
      await updateWorkspaceMember(member.id, { botName: trimmed || null });
      setMember({ ...member, botName: trimmed || undefined });
    } catch {
      setBotName(member.botName ?? '');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEntryMessageBlur = async () => {
    if (!member || isSaving) return;
    const trimmed = botEntryMessage.trim().slice(0, 500);
    if (trimmed === (member.botEntryMessage ?? '')) return;
    setIsSaving(true);
    try {
      await updateWorkspaceMember(member.id, { botEntryMessage: trimmed || null });
      setMember({ ...member, botEntryMessage: trimmed || undefined });
    } catch {
      setBotEntryMessage(member.botEntryMessage ?? '');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <StyledContainer>
        <H2Title title="Meeting Recording" description="Loading settings..." />
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      {/* API Key Status */}
      <div>
        <H2Title
          title="Meeting BaaS Connection"
          description="Meeting BaaS records your meetings and syncs transcripts into Twenty"
        />
        <StyledCard>
          <StyledIconContainer>
            <span style={{ fontSize: 20 }}>🎥</span>
          </StyledIconContainer>
          <StyledTextContainer>
            <StyledTitle>API Key</StyledTitle>
            <StyledDescription>
              {apiKeyConfigured
                ? 'Your Meeting BaaS API key is configured'
                : 'No API key configured — add MEETING_BAAS_API_KEY in app variables'}
            </StyledDescription>
          </StyledTextContainer>
          <Status
            color={apiKeyConfigured ? 'green' : 'red'}
            text={apiKeyConfigured ? 'Connected' : 'Not Set'}
          />
        </StyledCard>
      </div>

      {/* Calendar Connection Banner */}
      {hasCalendar === false && (
        <Callout
          variant="warning"
          title="No calendar connected"
          description="Connect your Google or Microsoft calendar in Settings → Accounts to enable automatic meeting recording."
        />
      )}

      {/* Recording Preference */}
      <div>
        <H2Title
          title="Recording Preference"
          description="Choose which meetings are automatically recorded when they have a conference link"
        />
        <StyledRadioGroup>
          {PREFERENCE_OPTIONS.map((option) => (
            <StyledRadioLabel key={option.value} selected={preference === option.value}>
              <StyledRadioInput
                type="radio"
                name="recordingPreference"
                value={option.value}
                checked={preference === option.value}
                onChange={() => handlePreferenceChange(option.value)}
                disabled={isSaving}
              />
              <StyledRadioTextContainer>
                <StyledRadioTitle>{option.title}</StyledRadioTitle>
                <StyledRadioDescription>{option.description}</StyledRadioDescription>
              </StyledRadioTextContainer>
            </StyledRadioLabel>
          ))}
        </StyledRadioGroup>
      </div>

      {/* Bot Customization */}
      <div>
        <H2Title
          title="Bot Customization"
          description="Customize how the recording bot appears when it joins your meetings"
        />
        <StyledFieldGroup>
          <div>
            <StyledFieldLabel>Bot name</StyledFieldLabel>
            <StyledTextInput
              type="text"
              placeholder="Twenty CRM Recorder"
              value={botName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBotName(e.target.value)}
              onBlur={handleBotNameBlur}
              disabled={isSaving}
            />
          </div>
          <div>
            <StyledFieldLabel>Entry message</StyledFieldLabel>
            <StyledTextInput
              type="text"
              placeholder="Message posted in chat when the bot joins"
              value={botEntryMessage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBotEntryMessage(e.target.value.slice(0, 500))
              }
              onBlur={handleEntryMessageBlur}
              disabled={isSaving}
              maxLength={500}
            />
            <StyledCharCount over={botEntryMessage.length >= 500}>
              {botEntryMessage.length}/500
            </StyledCharCount>
          </div>
        </StyledFieldGroup>
      </div>

      {preference !== 'RECORD_NONE' && !apiKeyConfigured && (
        <Callout
          variant="info"
          title="API key required"
          description="Recording is enabled but no API key is set. Add MEETING_BAAS_API_KEY in the app's variables to start recording."
        />
      )}
    </StyledContainer>
  );
};

export const SETTINGS_FRONT_COMPONENT_ID = 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b';

export default defineFrontComponent({
  universalIdentifier: SETTINGS_FRONT_COMPONENT_ID,
  name: 'meeting-baas-settings',
  description: 'Settings panel for Meeting BaaS recording preferences and connection status',
  component: MeetingBaasSettings,
});
