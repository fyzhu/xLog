/* eslint-disable react/prop-types */
import { memo, useCallback, useState } from "react"
import { usePopper } from "react-popper"

import { EditorView } from "@codemirror/view"
import { Popover } from "@headlessui/react"

import type { ICommand } from "~/editor"
import { useTranslation } from "~/lib/i18n/client"
import { isMacOS } from "~/lib/utils"

import { Tooltip } from "./Tooltip"

export interface EditorToolbarProps {
  view?: EditorView
  toolbars: ICommand[]
}

enum ToolbarMode {
  Normal,
  Preview,
}

type IToolbarItemProps = ICommand<any> & { view?: EditorView }

const keyDisplay = (shortcut?: { key?: string }) => {
  return shortcut?.key
    ? `(${shortcut?.key.replace("Mod", isMacOS() ? "⌘" : "Ctrl")})`
    : ""
}

const ToolbarItemWithPopover = ({
  name,
  icon,
  label,
  execute,
  ui,
  view,
  shortcut,
}: IToolbarItemProps) => {
  const { t } = useTranslation("dashboard")
  let [popoverButtonRef, setPopoverButtonRef] =
    useState<HTMLButtonElement | null>(null)
  let [popoverPanelRef, setPopoverPanelRef] = useState<HTMLDivElement | null>(
    null,
  )
  let { styles: popStyles, attributes: popAttributes } = usePopper(
    popoverButtonRef,
    popoverPanelRef,
  )
  return (
    <Popover key={name}>
      {({ open }: { open: boolean }) => (
        <>
          <Tooltip
            key={name}
            label={`${t(label)}${keyDisplay(shortcut)}`}
            placement="bottom"
          >
            <Popover.Button
              key={name}
              className="w-9 h-9 transition-colors text-lg border border-transparent rounded flex items-center justify-center text-zinc-500 group-hover:text-zinc-600 hover:text-zinc-500 hover:border-zinc-300 hover:bg-zinc-100"
              ref={setPopoverButtonRef}
            >
              <span className={icon}></span>
            </Popover.Button>
          </Tooltip>
          <Popover.Panel
            ref={setPopoverPanelRef}
            className="z-10"
            style={popStyles.popper}
            {...popAttributes.popper}
          >
            {ui &&
              view &&
              ui({
                transferPayload: (payload) => {
                  view &&
                    execute({
                      view,
                      options: { container: view.dom },
                      payload,
                    })
                },
                view,
              })}
          </Popover.Panel>
        </>
      )}
    </Popover>
  )
}

export const EditorToolbar = memo(({ view, toolbars }: EditorToolbarProps) => {
  const { t } = useTranslation("dashboard")
  const renderToolbar = useCallback(
    (mode: ToolbarMode) =>
      // eslint-disable-next-line react/display-name
      ({ name, icon, label, execute, ui, shortcut }: ICommand) => {
        return ui ? (
          <ToolbarItemWithPopover
            key={name}
            name={name}
            icon={icon}
            label={label}
            execute={execute}
            ui={ui}
            view={view}
            shortcut={shortcut}
          />
        ) : (
          <Tooltip
            key={name}
            label={`${t(label)}${keyDisplay(shortcut)}`}
            placement="bottom"
          >
            <button
              key={name}
              title={name}
              type="button"
              className={
                "w-9 h-9 transition-colors text-lg border border-transparent rounded flex items-center justify-center text-zinc-500 group-hover:text-zinc-600 hover:text-zinc-500 hover:border-zinc-300 hover:bg-zinc-100"
              }
              onClick={() => {
                view &&
                  execute({
                    view,
                    options: { container: view.dom },
                  })
              }}
            >
              <span className={icon}></span>
            </button>
          </Tooltip>
        )
      },
    [view, t],
  )

  return (
    <div className="flex group">
      <div className="flex-1 flex space-x-1">
        {toolbars?.map(renderToolbar(ToolbarMode.Normal))}
      </div>
    </div>
  )
})

EditorToolbar.displayName = "EditorToolbar"
