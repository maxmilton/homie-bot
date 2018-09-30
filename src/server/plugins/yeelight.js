import yl from 'yeelight-awesome';

function getDevice() {
  return new Promise((resolve) => {
    const discover = new yl.Discover({
      port: 1982,
      debug: true,
    });

    discover.once('deviceAdded', resolve);

    discover
      .start()
      .catch(console.error.bind(console))
      .then(() => discover.destroy());
  });
}

const device = getDevice();

export async function toggle(req, res) {
  const light = await device;

  const yeelight = new yl.Yeelight({
    lightIp: light.host,
    lightPort: light.port,
  });

  yeelight.on('connected', () => {
    yeelight.toggle();

    yeelight.on('commandSuccess', () => {
      yeelight.disconnect();
      res.end();
    });
  });

  yeelight.connect();
}

export async function command(req, res) {
  const light = await device;
  console.log('## LIGHT', light);

  const yeelight = new yl.Yeelight({
    lightIp: light.host,
    lightPort: light.port,
  });

  yeelight.on('connected', () => {
    yeelight.startColorFlow([
      new yl.FlowState(2000, 2, 2700, 100),
      new yl.FlowState(2000, 1, 255, 50),
      new yl.FlowState(2000, 7, 1500, 30),
      new yl.FlowState(2000, 2, 5000, 45),
      new yl.FlowState(2000, 2, 3000, 25),
    ], yl.StartFlowAction.LED_STAY);

    yeelight.on('commandSuccess', () => {
      yeelight.disconnect();
      res.end();
    });
  });

  yeelight.connect();
}

export async function red(req, res) {
  const light = await device;

  const yeelight = new yl.Yeelight({
    lightIp: light.host,
    lightPort: light.port,
  });

  yeelight.on('connected', () => {
    // yeelight.setRGB(new yl.Color(255, 0, 0), 'smooth', 1000);
    yeelight.setHSV(0, 100, 'smooth', 1000);

    yeelight.on('commandSuccess', () => {
      yeelight.disconnect();
      res.end();
    });
  });

  yeelight.connect();
}

export async function blue(req, res) {
  const light = await device;

  const yeelight = new yl.Yeelight({
    lightIp: light.host,
    lightPort: light.port,
  });

  yeelight.on('connected', () => {
    yeelight.setRGB(new yl.Color(0, 0, 255), 'smooth', 1000);

    yeelight.on('commandSuccess', () => {
      yeelight.disconnect();
      res.end();
    });
  });

  yeelight.connect();
}

export async function dim(req, res) {
  const light = await device;

  const yeelight = new yl.Yeelight({
    lightIp: light.host,
    lightPort: light.port,
  });

  yeelight.on('connected', () => {
    yeelight.setBright(3, 'smooth', 1000);

    yeelight.on('commandSuccess', () => {
      yeelight.disconnect();
      res.end();
    });
  });

  yeelight.connect();
}

export async function bright(req, res) {
  const light = await device;

  const yeelight = new yl.Yeelight({
    lightIp: light.host,
    lightPort: light.port,
  });

  yeelight.on('connected', () => {
    yeelight.setBright(100, 'smooth', 1000);

    yeelight.on('commandSuccess', () => {
      yeelight.disconnect();
      res.end();
    });
  });

  yeelight.connect();
}
