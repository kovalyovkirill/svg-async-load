Общий список иконок

```typescript jsx
import { Icon } from './index.tsx';
import { ICON_TYPE_NAMES } from './models';

<div style={{  display: 'flex', flexWrap: 'wrap', gap: 12 }}>
  {ICON_TYPE_NAMES.map((name) => (
    <div key={name} style={{ width: 100, height: 60 }}>
      <p style={{ margin: 0, marginBottom: 12 }}>{name}</p>
      <Icon name={name} id={`data-${name}`} />
    </div>
  ))}
</div>;
```

`view` - влияет на цвет

```typescript jsx
import { Icon } from './index.tsx';
import { ICON_TYPE_NAMES } from './models';

<div style={{  display: 'flex', flexWrap: 'wrap', gap: 12 }}>
  <Icon name="close" id={`data-${name}`} view="green" />
  <Icon name="copy" id={`data-${name}`} view="red" />
</div>;
```

`size` - влияет на размер

```typescript jsx
import { Icon } from './index.tsx';
import { ICON_TYPE_NAMES } from './models';

<div style={{  display: 'flex', flexWrap: 'wrap', gap: 12 }}>
  <Icon name="close" id={`data-${name}`} view="green" size="sm"/>
  <Icon name="close" id={`data-${name}`} view="red" />
  <Icon name="close" id={`data-${name}`} size="lg"/>
  <Icon name="close" id={`data-${name}`} size={120} />
</div>;
```