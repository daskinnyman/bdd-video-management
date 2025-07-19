import React from "react";

// Mock Mantine components to avoid React 19 compatibility issues and MantineProvider dependency
jest.mock("@mantine/core", () => {
  const originalModule = jest.requireActual("@mantine/core");

  return {
    ...originalModule,
    TextInput: ({
      label,
      placeholder,
      "data-testid": testId,
      error,
      onChange,
      required,
      ...props
    }: {
      label?: string;
      placeholder?: string;
      "data-testid"?: string;
      error?: string;
      onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
      required?: boolean;
      [key: string]: unknown;
    }) => (
      <div>
        <label>{label}</label>
        <input
          data-testid={testId}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
          {...props}
        />
        {error && <span>{error}</span>}
      </div>
    ),
    PasswordInput: ({
      label,
      placeholder,
      "data-testid": testId,
      error,
      onChange,
      required,
      ...props
    }: {
      label?: string;
      placeholder?: string;
      "data-testid"?: string;
      error?: string;
      onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
      required?: boolean;
      [key: string]: unknown;
    }) => (
      <div>
        <label>{label}</label>
        <input
          type="password"
          data-testid={testId}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
          {...props}
        />
        {error && <span>{error}</span>}
      </div>
    ),
    Textarea: ({
      label,
      placeholder,
      "data-testid": testId,
      error,
      onChange,
      ...props
    }: {
      label?: string;
      placeholder?: string;
      "data-testid"?: string;
      error?: string;
      onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
      [key: string]: unknown;
    }) => (
      <div>
        <label>{label}</label>
        <textarea
          data-testid={testId}
          placeholder={placeholder}
          onChange={onChange}
          {...props}
        />
        {error && <span>{error}</span>}
      </div>
    ),
    Select: ({
      label,
      placeholder,
      "data-testid": testId,
      error,
      onChange,
      required,
      data,
      ...props
    }: {
      label?: string;
      placeholder?: string;
      "data-testid"?: string;
      error?: string;
      onChange?: (value: string | null) => void;
      required?: boolean;
      data?: Array<{ value: string; label: string }>;
      [key: string]: unknown;
    }) => (
      <div>
        <label>{label}</label>
        <select
          data-testid={testId}
          onChange={(e) => onChange?.(e.target.value)}
          required={required}
          {...props}
        >
          <option value="">{placeholder}</option>
          {data?.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        {error && <span>{error}</span>}
      </div>
    ),
    Button: ({
      children,
      "data-testid": testId,
      disabled,
      loading,
      type,
      ...props
    }: {
      children?: React.ReactNode;
      "data-testid"?: string;
      disabled?: boolean;
      loading?: boolean;
      type?: "submit" | "reset" | "button";
      [key: string]: unknown;
    }) => (
      <button
        data-testid={testId}
        disabled={disabled || loading}
        type={type}
        {...props}
      >
        {loading ? "Loading..." : children}
      </button>
    ),
    FileInput: ({
      label,
      "data-testid": testId,
      error,
      onChange,
      required,
      ...props
    }: {
      label?: string;
      "data-testid"?: string;
      error?: string;
      onChange?: (file: File | null) => void;
      required?: boolean;
      [key: string]: unknown;
    }) => (
      <div>
        <label>{label}</label>
        <input
          type="file"
          data-testid={testId}
          onChange={(e) => onChange?.(e.target.files?.[0] || null)}
          required={required}
          {...props}
        />
        {error && <span>{error}</span>}
      </div>
    ),
    Alert: ({
      children,
      "data-testid": testId,
      ...props
    }: {
      children?: React.ReactNode;
      "data-testid"?: string;
      [key: string]: unknown;
    }) => (
      <div data-testid={testId} {...props}>
        {children}
      </div>
    ),
    Paper: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    Title: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <h2 {...props}>{children}</h2>,
    Stack: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    Group: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    Box: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    Container: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    Grid: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    Col: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    Row: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    Flex: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    Center: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    SimpleGrid: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    Space: ({ ...props }: { [key: string]: unknown }) => <div {...props} />,
    Divider: ({ ...props }: { [key: string]: unknown }) => <hr {...props} />,
    Text: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <span {...props}>{children}</span>,
    Anchor: ({
      children,
      href,
      ...props
    }: {
      children?: React.ReactNode;
      href?: string;
      [key: string]: unknown;
    }) => (
      <a href={href} {...props}>
        {children}
      </a>
    ),
    Code: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <code {...props}>{children}</code>,
    Kbd: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <kbd {...props}>{children}</kbd>,
    List: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <ul {...props}>{children}</ul>,
    ListItem: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <li {...props}>{children}</li>,
    ThemeIcon: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    ActionIcon: ({
      children,
      onClick,
      ...props
    }: {
      children?: React.ReactNode;
      onClick?: () => void;
      [key: string]: unknown;
    }) => (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    ),
    CloseButton: ({
      onClick,
      ...props
    }: {
      onClick?: () => void;
      [key: string]: unknown;
    }) => (
      <button onClick={onClick} {...props}>
        ×
      </button>
    ),
    CopyButton: ({
      children,
      value,
      ...props
    }: {
      children?: React.ReactNode;
      value?: string;
      [key: string]: unknown;
    }) => (
      <button
        onClick={() => navigator.clipboard?.writeText(value || "")}
        {...props}
      >
        {children}
      </button>
    ),
    NumberInput: ({
      label,
      "data-testid": testId,
      value,
      onChange,
      ...props
    }: {
      label?: string;
      "data-testid"?: string;
      value?: number;
      onChange?: (value: number | "") => void;
      [key: string]: unknown;
    }) => (
      <div>
        <label>{label}</label>
        <input
          type="number"
          data-testid={testId}
          value={value}
          onChange={(e) =>
            onChange?.(e.target.value === "" ? "" : Number(e.target.value))
          }
          {...props}
        />
      </div>
    ),
    MultiSelect: ({
      label,
      "data-testid": testId,
      error,
      onChange,
      data,
      ...props
    }: {
      label?: string;
      "data-testid"?: string;
      error?: string;
      onChange?: (value: string[]) => void;
      data?: Array<{ value: string; label: string }>;
      [key: string]: unknown;
    }) => (
      <div>
        <label>{label}</label>
        <select
          multiple
          data-testid={testId}
          onChange={(e) => {
            const values = Array.from(e.target.selectedOptions).map(
              (option) => option.value
            );
            onChange?.(values);
          }}
          {...props}
        >
          {data?.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        {error && <span>{error}</span>}
      </div>
    ),
    Checkbox: ({
      label,
      "data-testid": testId,
      checked,
      onChange,
      ...props
    }: {
      label?: string;
      "data-testid"?: string;
      checked?: boolean;
      onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
      [key: string]: unknown;
    }) => (
      <div>
        <label>
          <input
            type="checkbox"
            data-testid={testId}
            checked={checked}
            onChange={onChange}
            {...props}
          />
          {label}
        </label>
      </div>
    ),
    Radio: ({
      label,
      "data-testid": testId,
      checked,
      onChange,
      ...props
    }: {
      label?: string;
      "data-testid"?: string;
      checked?: boolean;
      onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
      [key: string]: unknown;
    }) => (
      <div>
        <label>
          <input
            type="radio"
            data-testid={testId}
            checked={checked}
            onChange={onChange}
            {...props}
          />
          {label}
        </label>
      </div>
    ),
    Switch: ({
      label,
      "data-testid": testId,
      checked,
      onChange,
      ...props
    }: {
      label?: string;
      "data-testid"?: string;
      checked?: boolean;
      onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
      [key: string]: unknown;
    }) => (
      <div>
        <label>
          <input
            type="checkbox"
            data-testid={testId}
            checked={checked}
            onChange={onChange}
            {...props}
          />
          {label}
        </label>
      </div>
    ),
    Slider: ({
      "data-testid": testId,
      value,
      onChange,
      ...props
    }: {
      "data-testid"?: string;
      value?: number;
      onChange?: (value: number) => void;
      [key: string]: unknown;
    }) => (
      <input
        type="range"
        data-testid={testId}
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
        {...props}
      />
    ),
    DateInput: ({
      label,
      "data-testid": testId,
      value,
      onChange,
      ...props
    }: {
      label?: string;
      "data-testid"?: string;
      value?: Date | null;
      onChange?: (value: Date | null) => void;
      [key: string]: unknown;
    }) => (
      <div>
        <label>{label}</label>
        <input
          type="date"
          data-testid={testId}
          value={value ? value.toISOString().split("T")[0] : ""}
          onChange={(e) =>
            onChange?.(e.target.value ? new Date(e.target.value) : null)
          }
          {...props}
        />
      </div>
    ),
    TimeInput: ({
      label,
      "data-testid": testId,
      value,
      onChange,
      ...props
    }: {
      label?: string;
      "data-testid"?: string;
      value?: Date | null;
      onChange?: (value: Date | null) => void;
      [key: string]: unknown;
    }) => (
      <div>
        <label>{label}</label>
        <input
          type="time"
          data-testid={testId}
          value={value ? value.toTimeString().slice(0, 5) : ""}
          onChange={(e) => {
            if (e.target.value) {
              const [hours, minutes] = e.target.value.split(":");
              const date = new Date();
              date.setHours(Number(hours), Number(minutes));
              onChange?.(date);
            } else {
              onChange?.(null);
            }
          }}
          {...props}
        />
      </div>
    ),
    Modal: ({
      children,
      opened,
      onClose,
      ...props
    }: {
      children?: React.ReactNode;
      opened?: boolean;
      onClose?: () => void;
      [key: string]: unknown;
    }) =>
      opened ? (
        <div data-testid="modal" {...props}>
          {children}
          <button onClick={onClose}>Close</button>
        </div>
      ) : null,
    Drawer: ({
      children,
      opened,
      onClose,
      ...props
    }: {
      children?: React.ReactNode;
      opened?: boolean;
      onClose?: () => void;
      [key: string]: unknown;
    }) =>
      opened ? (
        <div data-testid="drawer" {...props}>
          {children}
          <button onClick={onClose}>Close</button>
        </div>
      ) : null,
    Menu: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    MenuTarget: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    MenuDropdown: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    MenuItem: ({
      children,
      onClick,
      ...props
    }: {
      children?: React.ReactNode;
      onClick?: () => void;
      [key: string]: unknown;
    }) => (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    ),
    Tabs: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    TabsList: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    TabsTab: ({
      children,
      onClick,
      ...props
    }: {
      children?: React.ReactNode;
      onClick?: () => void;
      [key: string]: unknown;
    }) => (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    ),
    TabsPanel: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    Card: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    CardHeader: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    CardBody: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    CardFooter: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    Badge: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <span {...props}>{children}</span>,
    Avatar: ({
      children,
      src,
      alt,
      ...props
    }: {
      children?: React.ReactNode;
      src?: string;
      alt?: string;
      [key: string]: unknown;
    }) => <div {...props}>{src ? <img src={src} alt={alt} /> : children}</div>,
    Image: ({
      src,
      alt,
      ...props
    }: {
      src?: string;
      alt?: string;
      [key: string]: unknown;
    }) => <img src={src} alt={alt} {...props} />,
    Loader: ({ ...props }: { [key: string]: unknown }) => (
      <div data-testid="loader" {...props}>
        Loading...
      </div>
    ),
    Skeleton: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    Tooltip: ({
      children,
      label,
      ...props
    }: {
      children?: React.ReactNode;
      label?: string;
      [key: string]: unknown;
    }) => (
      <div title={label} {...props}>
        {children}
      </div>
    ),
    Popover: ({
      children,
      opened,
      ...props
    }: {
      children?: React.ReactNode;
      opened?: boolean;
      [key: string]: unknown;
    }) => (opened ? <div {...props}>{children}</div> : null),
    PopoverTarget: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    PopoverDropdown: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
  };
});

// Mock @tabler/icons-react
jest.mock("@tabler/icons-react", () => ({
  IconAlertCircle: ({ size }: { size?: number }) => (
    <span data-testid="icon-alert-circle" style={{ fontSize: size }}>
      ⚠️
    </span>
  ),
  IconUpload: ({ size }: { size?: number }) => (
    <span data-testid="icon-upload" style={{ fontSize: size }}>
      📤
    </span>
  ),
  IconEye: ({ size }: { size?: number }) => (
    <span data-testid="icon-eye" style={{ fontSize: size }}>
      👁️
    </span>
  ),
  IconEyeOff: ({ size }: { size?: number }) => (
    <span data-testid="icon-eye-off" style={{ fontSize: size }}>
      🙈
    </span>
  ),
  IconSearch: ({ size }: { size?: number }) => (
    <span data-testid="icon-search" style={{ fontSize: size }}>
      🔍
    </span>
  ),
  IconX: ({ size }: { size?: number }) => (
    <span data-testid="icon-x" style={{ fontSize: size }}>
      ✕
    </span>
  ),
  IconCheck: ({ size }: { size?: number }) => (
    <span data-testid="icon-check" style={{ fontSize: size }}>
      ✓
    </span>
  ),
  IconPlus: ({ size }: { size?: number }) => (
    <span data-testid="icon-plus" style={{ fontSize: size }}>
      ➕
    </span>
  ),
  IconMinus: ({ size }: { size?: number }) => (
    <span data-testid="icon-minus" style={{ fontSize: size }}>
      ➖
    </span>
  ),
  IconEdit: ({ size }: { size?: number }) => (
    <span data-testid="icon-edit" style={{ fontSize: size }}>
      ✏️
    </span>
  ),
  IconTrash: ({ size }: { size?: number }) => (
    <span data-testid="icon-trash" style={{ fontSize: size }}>
      🗑️
    </span>
  ),
  IconSettings: ({ size }: { size?: number }) => (
    <span data-testid="icon-settings" style={{ fontSize: size }}>
      ⚙️
    </span>
  ),
  IconUser: ({ size }: { size?: number }) => (
    <span data-testid="icon-user" style={{ fontSize: size }}>
      👤
    </span>
  ),
  IconLogout: ({ size }: { size?: number }) => (
    <span data-testid="icon-logout" style={{ fontSize: size }}>
      🚪
    </span>
  ),
  IconLogin: ({ size }: { size?: number }) => (
    <span data-testid="icon-login" style={{ fontSize: size }}>
      🔑
    </span>
  ),
  IconHome: ({ size }: { size?: number }) => (
    <span data-testid="icon-home" style={{ fontSize: size }}>
      🏠
    </span>
  ),
  IconVideo: ({ size }: { size?: number }) => (
    <span data-testid="icon-video" style={{ fontSize: size }}>
      🎥
    </span>
  ),
  IconPlay: ({ size }: { size?: number }) => (
    <span data-testid="icon-play" style={{ fontSize: size }}>
      ▶️
    </span>
  ),
  IconPause: ({ size }: { size?: number }) => (
    <span data-testid="icon-pause" style={{ fontSize: size }}>
      ⏸️
    </span>
  ),
  IconVolume: ({ size }: { size?: number }) => (
    <span data-testid="icon-volume" style={{ fontSize: size }}>
      🔊
    </span>
  ),
  IconVolumeOff: ({ size }: { size?: number }) => (
    <span data-testid="icon-volume-off" style={{ fontSize: size }}>
      🔇
    </span>
  ),
  IconFullscreen: ({ size }: { size?: number }) => (
    <span data-testid="icon-fullscreen" style={{ fontSize: size }}>
      ⛶
    </span>
  ),
  IconFullscreenExit: ({ size }: { size?: number }) => (
    <span data-testid="icon-fullscreen-exit" style={{ fontSize: size }}>
      ⛶
    </span>
  ),
}));
