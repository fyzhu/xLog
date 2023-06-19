import type { NoteMetadata } from "crossbell"
import dynamic from "next/dynamic"
import { useState } from "react"

import { useDate } from "~/hooks/useDate"
import { useTranslation } from "~/lib/i18n/client"

const DynamicPageContent = dynamic(() => import("../common/PageContent"), {
  ssr: false,
})

export const ImportPreview = ({ note }: { note: NoteMetadata }) => {
  const date = useDate()
  const [showcaseMore, setShowcaseMore] = useState(false)
  const { t } = useTranslation("common")

  return (
    <article className="border rounded-xl p-6 mt-4">
      <div>
        <h2 className="xlog-post-title text-3xl font-bold">{note.title}</h2>
      </div>
      <div className="text-zinc-400 mt-4 space-x-5 flex items-center">
        <time
          dateTime={date.formatToISO(note.date_published!)}
          className="xlog-post-date whitespace-nowrap"
        >
          {date.formatDate(note.date_published!, undefined)}
        </time>
        {!!note.tags?.filter((tag) => tag !== "post" && tag !== "page")
          .length && (
          <span className="xlog-post-tags space-x-1 truncate min-w-0">
            {note.tags
              ?.filter((tag) => tag !== "post" && tag !== "page")
              .map((tag) => (
                <span className="hover:text-zinc-600" key={tag}>
                  #{tag}
                </span>
              ))}
          </span>
        )}
      </div>
      <div
        className={`overflow-y-hidden relative ${
          showcaseMore ? "" : "max-h-[200px]"
        }`}
      >
        <div
          className={`absolute bottom-0 h-20 left-0 right-0 bg-gradient-to-t from-white via-white z-40 flex items-end justify-center font-bold cursor-pointer ${
            showcaseMore ? "hidden" : ""
          }`}
          onClick={() => setShowcaseMore(true)}
        >
          {t("Show more")}
        </div>
        <DynamicPageContent
          className="mt-4"
          content={note?.content}
        ></DynamicPageContent>
      </div>
    </article>
  )
}
