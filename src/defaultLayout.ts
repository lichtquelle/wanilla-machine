/**
 * @author    Yannick Deubel (https://github.com/yandeu)
 * @copyright Copyright (c) 2021 Yannick Deubel
 * @license   {@link https://github.com/lichtquelle/wanilla-machine/blob/main/LICENSE LICENSE}
 */

export const defaultLayout = /* html */ `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="wanilla.css" />
    <title>markdown</title>
  </head>
  <body>

    <main class="w-content">
      <div class="w-wrapper">
        {{markdown}}
      </div>
    </main>

  </body>
</html>
`
