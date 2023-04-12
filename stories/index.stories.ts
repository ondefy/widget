import '../index.js';

export default {
  title: 'OndefyRampButton',
  component: 'ondefy-ramp-button',
  argTypes: {
    frameBorderRadius: { control: 'number' },
    tokenId: { control: 'string' },
    // header: { control: 'text' },
    colorPrimary: { control: 'color' },
  },
};

interface Story<T> {
  (args: T): string;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  frameBorderRadius?: string;
  networkId?: string;
  tokenId?: string;
  colorPrimary?: string;
}

const Template: Story<ArgTypes> = (args: ArgTypes) => {
  const { frameBorderRadius, tokenId, colorPrimary = '' } = args;

  return `
    <ondefy-ramp-button frame-border-radius="${frameBorderRadius}" token-id="${tokenId}" color-primary="${colorPrimary.replace(
    '#',
    ''
  )}">
        <button>Launch App</button>
    </ondefy-ramp-button>
  `;
};

export const Default = Template.bind({});
Default.args = {
  frameBorderRadius: '18',
  tokenId: 'ethereum',
};

// export const CustomHeader = Template.bind({});
// CustomHeader.args = {
//   header: 'My header',
// };
