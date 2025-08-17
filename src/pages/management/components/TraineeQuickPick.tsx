import { useAppState } from "@/state/appState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  onSelect: (email: string) => void;
}

const TraineeQuickPick = ({ onSelect }: Props) => {
  const passcodes = useAppState((s) => s.passcodes);
  const active = passcodes.filter((p) => !p.isUsed && new Date(p.expiresAt) > new Date());

  if (active.length === 0) return null;

  return (
    <div className="pt-2 space-y-2">
      <div className="text-xs text-muted-foreground">Active trainee emails</div>
      <div className="flex flex-wrap gap-2">
        {active.map((p) => (
          <Button key={p.id} variant="outline" size="sm" onClick={() => onSelect(p.traineeEmail)}>
            {p.traineeEmail}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TraineeQuickPick;
