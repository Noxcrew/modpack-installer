import clsx from "clsx";
import { observer } from "mobx-react-lite";

import InformationCircleIcon from "../../assets/icon/information_circle.svg";
import { useInstaller } from "../context";
import type { InstallerModState } from "../installer/installer";

import Switch from "./Switch";

interface ModListItemProps {
  progress?: boolean;
  mod: InstallerModState;

  onToggle(): void;
}

const ModListItem = observer((props: ModListItemProps) => {
  const { progress, mod, onToggle } = props;

  const mapStateLabel = (): string => {
    if (!mod.include) {
      return "Skipped";
    }

    switch (mod.state) {
      case "pending":
        return "Pending";
      case "installing":
        return "Installing";
      case "installed":
        return "Installed";
      case "failed":
        return "Failed";
    }
  };

  const mapStateStyle = (): string => {
    if (!mod.include) {
      // Skipped
      return "bg-green-500/20 text-green-500";
    }

    switch (mod.state) {
      case "pending":
      case "installing":
        return "bg-yellow-500/20 text-yellow-500";
      case "installed":
        return "bg-green-500/20 text-green-500";
      case "failed":
        return "bg-red-500/20 text-red-500";
    }
  };

  return (
    <li className="px-4 py-3 flex flex-row items-center">
      <h3 className="text-neutral-200 grow relative group">
        {mod.mod.name}
        {mod.mod.description && (
          <>
            <div className="absolute hidden group-hover:block text-xs font-medium bg-neutral-700/80 z-20 rounded-md px-2 py-1 transition-all">
              {mod.mod.description}
            </div>
            <InformationCircleIcon className="ml-2 w-3 h-3 text-neutral-400 inline" />
          </>
        )}
      </h3>
      {!progress && (
        <Switch
          value={mod.include}
          onChange={onToggle}
          disabled={mod.mod.option === "required"}
        />
      )}
      {progress && (
        <div
          className={clsx(
            "px-2 py-1 w-24 text-center text-sm font-semibold rounded-lg transition duration-500",
            mapStateStyle()
          )}
        >
          {mapStateLabel()}
        </div>
      )}
    </li>
  );
});

export interface ModListProps {
  progress?: boolean;
}

type ModIndex = Record<string, InstallerModState[]>;

export default observer(function ModList({ progress }: ModListProps) {
  const { installer } = useInstaller();

  const modIndex: ModIndex = installer.mods
    .slice()
    .sort((a, b) => {
      if (a.mod.option === "required") {
        return 1;
      } else if (b.mod.option === "required") {
        return -1;
      }

      return a.mod.category < b.mod.category ? -1 : 1;
    })
    .reduce<ModIndex>((index, state) => {
      const category =
        state.mod.option === "required" ? "required" : state.mod.category;
      (index[category] = index[category] || []).push(state);
      return index;
    }, {});

  return (
    <div className="flex flex-col grow">
      <h2 className="text-white font-semibold p-4 border-b border-neutral-800/50">
        Mods
      </h2>
      <div className="grow list-none overflow-y-scroll">
        {Object.entries(modIndex).map(([category, mods]) => (
          <div key={category}>
            <div className="sticky top-0 bg-neutral-800/80 px-4 py-2 text-xs text-white font-semibold uppercase z-10">
              {category} ({mods.length})
            </div>
            {mods.map((mod) => (
              <ModListItem
                mod={mod}
                onToggle={() => mod.toggle()}
                progress={progress}
                key={mod.mod.path}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});
