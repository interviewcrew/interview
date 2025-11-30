"use client";

import { useState, useRef, useEffect } from "react";

interface Command {
  input: string;
  output?: string;
}

interface TeamMember {
  username: string;
  email: string;
  fullname: string;
  description: string[];
  links: { link: string; text: string; label: string }[];
  role: string;
}

const team: TeamMember[] = [
  {
    username: "sadjad",
    email: "sadjad@interviewcrew.io",
    fullname: "Sadjad Fallah",
    description: [
      `Sadjad is a software engineer and entrepreneur with 14 years of experience in the industry.`,
      `He had is own startups for 9 years and they were in any field imaginable. He has conducted countless interviews in his past experience`,
      `He has a passion for building tools that help people`,
    ],
    links: [
      {
        link: "https://github.com/msadjad",
        text: "https://github.com/msadjad",
        label: "GitHub",
      },
      {
        link: "https://linkedin.com/in/msadjad",
        text: "https://linkedin.com/in/msadjad",
        label: "LinkedIn",
      },
      {
        link: "mailto:sadjad@interviewcrew.io",
        text: "sadjad@interviewcrew.io",
        label: "Email",
      },
    ],
    role: "Co-founder and CEO",
  },
  {
    username: "ali",
    email: "ali@interviewcrew.io",
    fullname: "Ali Nezamolmaleki",
    description: [],
    links: [
      {
        link: "https://github.com/alinzm",
        text: "https://github.com/alinzm",
        label: "GitHub",
      },
      {
        link: "https://linkedin.com/in/alinzm",
        text: "https://linkedin.com/in/alinzm",
        label: "LinkedIn",
      },
      {
        link: "mailto:ali@interviewcrew.io",
        text: "ali@interviewcrew.io",
        label: "Email",
      },
    ],
    role: "Co-founder and CRO",
  },
  {
    username: "yashar",
    email: "yashar@interviewcrew.io",
    fullname: "Yashar Imanlou",
    description: [],
    links: [
      {
        link: "https://github.com/yaim",
        text: "https://github.com/yaim",
        label: "GitHub",
      },
      {
        link: "https://linkedin.com/in/yasharimanlou",
        text: "https://linkedin.com/in/yasharimanlou",
        label: "LinkedIn",
      },
      {
        link: "mailto:yashar@interviewcrew.io",
        text: "yashar@interviewcrew.io",
        label: "Email",
      },
    ],
    role: "Co-founder and CTO",
  },
];

const commands: Record<string, (...args: string[]) => string> = {
  ls: () =>
    "<ul class='mt-4 mb-4'>" +
    Object.keys(commands)
      .filter((cmd) => cmd !== "ls" && cmd !== "help" && cmd !== "clear")
      .map(
        (cmd) =>
          `<li><span class="dark:text-orange-400 text-orange-600">${cmd}</span></li>`
      )
      .join("\n") +
    "</ul>",
  help: () => `
    <div><span class="dark:text-orange-400 text-orange-600">about</span> - cat README.md <div>
    <div><span class="dark:text-orange-400 text-orange-600">team</span> - ls -la /home/team <div>
    <div><span class="dark:text-orange-400 text-orange-600">who [username]</span> - whois [username] <div>
    <div><span class="dark:text-orange-400 text-orange-600">repo</span> - git remote -v <div>
    <div><span class="dark:text-orange-400 text-orange-600">ls</span> - list available commands <div>
    <div><span class="dark:text-orange-400 text-orange-600">clear</span> - clear screen <div>
  `,
  about: () => `
    <p>
      <span class="font-bold">Interview Crew</span> v0.1.0-beta
    </p>
    <p class="mt-4">
      We are an <span class="font-bold">AI-first recruitment agency</span> built by engineers, for engineers.
    </p>
    <p class="mt-2">
      > <span class="dark:text-green-400 text-green-600">Problem:</span> Traditional recruiting is broken. Interviews are biased, and prep tools are expensive.<br>
      > <span class="dark:text-green-400 text-green-600">Solution:</span> Open-source AI tools to mock interview, review resumes, and roadmap your career.<br>
      > <span class="dark:text-green-400 text-green-600">Goal:</span> We find the top 1% of "A-Players" and fast-track them to elite companies.
    </p>
    <p class="mt-4">
      All tools are <span class="font-bold">free && open-source</span>.
    </p>`,
  repo: () =>
    `<a class="link-color underline" href="https://github.com/interviewcrew/codebase" target="_blank">git clone https://github.com/interviewcrew/codebase.git</a>`,
  who: (username: string): string => {
    const user = team.find((t) => t.username === username);
    if (user) {
      return (
        `<div><span class="text-color">User: ${user.fullname}</span>` +
        `<span> [${user.role}]</span></div>` +
        `<div class="mt-4">${user.description
          .map((d) => `<p class="mt-1">> ${d}</p>`)
          .join("\n")}</div>` +
        `<div class="mt-4">Connections:</div>` +
        `<ul class="mt-1">${user.links
          .map(
            (l) =>
              `<li>- ${l.label}: <a class="link-color underline" href="${l.link}" target="_blank">${l.text}</a></li>`
          )
          .join("\n")}</ul>`
      );
    }
    return `error: user '${username}' not found. Try 'team' to list active users.`;
  },
  team: () =>
    "<div class='mt-4 mb-4 whitespace-pre'>" +
    "drwxr-xr-x  3 root  root  4096 Nov 19 10:00 .\n" +
    "drwxr-xr-x  5 root  root  4096 Nov 18 14:20 ..\n" +
    team
      .map(
        (p) =>
          '-rwxr-xr-x  1 ' +
          `<span class="dark:text-orange-400 text-orange-600">${p.username}</span>` +
          '  staff  ' +
          '8192 ' +
          'Nov 19 ' +
          '12:00 ' +
          p.fullname
      )
      .join("\n") +
    "</div>" +
    "<p>To inspect a user profile, run 'who <span class='dark:text-orange-400 text-orange-600'>[username]</span>'</p>",
  exit: () => "__EXIT__",

  clear: () => "__CLEAR__",
};

interface TerminalProps {
  exitTerminal: () => void;
}

export default function Terminal({ exitTerminal }: TerminalProps) {
  const [history, setHistory] = useState<Command[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();

    if (cmd) {
      const mainCommand = cmd.split(" ")[0];
      const args = cmd.split(" ").slice(1);
      const output = commands[mainCommand]
        ? commands[mainCommand](...args)
        : `command not found: ${cmd}. Type 'help' for available commands.`;

      if (output === "__EXIT__") {
        exitTerminal();
      }

      if (output === "__CLEAR__") {
        setHistory([]);
      } else {
        setHistory([...history, { input: cmd, output }]);
      }
    }

    setInput("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Keep cursor at end of input to avoid cursor movement keys and selection
  const keepCursorAtEnd = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    input.selectionStart = input.selectionEnd = input.value.length;
  };

  // Prevent cursor movement keys in the input field
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent cursor movement keys
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
      e.preventDefault();
    }
  };

  // Focus input when clicking anywhere in the terminal
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className="terminal font-neon box-border fixed bottom-0 left-0 right-0 h-[50vh] cursor-text mix-blend-multiply dark:mix-blend-screen"
      onClick={handleTerminalClick}
    >
      <div className="flex flex-col h-full overflow-y-auto origin-bottom-left [transition:transform_1.15s_cubic-bezier(0.5,0,0.82,1)_0.15s,opacity_0.5s_ease-in-out_0.23s] text-2xl mask-[linear-gradient(to_bottom,transparent_0%,black_10%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_10%)]">
        <div className="flex-1" />
        <div className="p-8">
          {history.map((cmd, i) => (
            <div key={i}>
              <p className="text-dim-color mt-0">~/candidate$ {cmd.input}</p>
              {cmd.output && (
                <div
                  className="mb-2 mt-2"
                  dangerouslySetInnerHTML={{ __html: cmd.output }}
                />
              )}
            </div>
          ))}

          <form onSubmit={handleSubmit}>
            <span className="text-color">~/candidate$</span>
            <span className="relative inline-block">
              <span className="invisible whitespace-pre">{input || " "}</span>

              <span
                className="cursor absolute top-[-2px]"
                style={{
                  left: input ? `${input.length + 1}ch` : "1ch",
                }}
              >
                {" "}
                ▋
              </span>
              <input
                ref={inputRef}
                type="text"
                className="bg-transparent border-none outline-none rounded-none caret-transparent text-color font-inherit text-inherit max-w-full p-0 whitespace-pre-wrap absolute left-[1ch] top-0 w-full"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onClick={keepCursorAtEnd}
                onSelect={keepCursorAtEnd}
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
            </span>
          </form>

          {history.length === 0 && (
            <p className="mt-0 mb-4">
              Type{" "}
              <span className="dark:text-orange-400 text-orange-600">help</span>{" "}
              to see available commands. Or type{" "}
              <span className="dark:text-orange-400 text-orange-600">exit</span>{" "}
              to exit the terminal.
            </p>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
