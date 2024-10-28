# liferayinclusive-workshop

### Setup

1. Download Liferay Portal 7.4 GA125 from https://www.liferay.com/es/downloads-community

2. Clone this repo

```
git clone git@github.com:marcoscv-work/liferayinclusive-workshop.git
```

3. Copy the `liferayinclusive-site-initializer.zip` located in `/dist` folder.

4. Paste the `liferayinclusive-site-initializer.zip` into the `/osgi/client-extensions` or `/deploy` folder inside your Liferay Portal 7.4 Bundle directory.

### If you want to install the site as workspace...

1. Install the latest version of blade (see https://learn.liferay.com/w/dxp/liferay-development/tooling/blade-cli)

2. Go to `/liferay-portal/workspaces`

```
blade init -v 7.4 my-liferay-workspace
```

3. Go to your liferay workspace

```
cd my-liferay-workspace
```

4. Create a directory `client-extensions`

```
mkdir client-extensions
```

5. In that directory clone this repo

```
git clone git@github.com:marcoscv-work/liferayinclusive-workshop.git
```

6. Go to the `liferayinclusive-workshop` directory

```
cd liferayinclusive-workshop
```

7. Deploy the module

```
../../gradlew deploy
```

Now you have a `.zip` file of your site to copy into `/deploy`
