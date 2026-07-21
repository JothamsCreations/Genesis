const stages = ["Idea", "Purpose", "Perspectives", "Premortem", "Foundations", "Build order", "Review"];

export function StageRail({ activeStage = 0 }: { activeStage?: number }) {
  return (
    <nav aria-label="Blueprint stages" className="stage-rail">
      <ol>
        {stages.map((stage, index) => {
          const active = index === activeStage;
          const done = index < activeStage;

          return (
            <li
              aria-current={active ? "step" : undefined}
              className={active ? "active" : done ? "done" : undefined}
              key={stage}
            >
              <span aria-hidden="true" className="stage-number">{String(index + 1).padStart(2, "0")}</span>
              <span>{stage}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
