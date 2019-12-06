const { capitalize } = require('lodash');

/**
 * HTML template generator for printable PDF views
 *
 * @param {object} content content to be injected into the template
 * @param {object} options optional content that modifies the template
 * @returns {string} hydrated HTML content in string form
 */
const generateHTMLTemplateForPDF = (content, options) => {
  return `<!DOCTYPE html>
    <html>
      <head>
        <title>${options.title || 'U.S. Tax Court'}</title>
        <meta charset="utf-8" />
        <style type="text/css">
          body {
            margin: 35px 50px;
            font-family: sans-serif;
            font-size: 10px;
          }

          h1 {
            padding-top: 10px;
            margin-bottom: 0px;
            font-size: 24px;
            text-align: center;
          }

          h2 {
            margin-top: 0px;
            font-size: 20px;
            font-weight: normal;
            text-align: center;
          }

          h3 {
            margin-top: 40px;
            margin-bottom: 30px;
            font-size: 18px;
            font-weight: normal;
            text-align: center;
            font-family: serif;
          }

          table {
            width: 100%;
            border: 1px solid #ccc;
            -webkit-border-horizontal-spacing: 0px;
            border-spacing: 0;
            -webkit-border-vertical-spacing: 0px;
          }

          th,
          td {
            padding: 12px 8px;
            border-bottom: 1px solid #ccc;
            text-align: left;
            vertical-align: top;
          }

          th {
            background-color: #f0f0f0;
            white-space: nowrap;
          }

          .panel {
            border: 1px solid #ccc;
            margin: 15px 0 5px 0;
          }

          .header {
            padding: 8px 10px;
            border-bottom: 1px solid #ccc;
            background: #f0f0f0;
            font-size: 10px;
            font-weight: bold;
          }

          .content {
            min-height: 15px;
            padding: 0 10px 10px 10px;
          }

          .no-wrap {
            white-space: nowrap;
          }

          .court-header {
            margin-bottom: 30px;
            font-family: serif;
          }

          .case-information #caption {
            width: 40%;
            float: left;
          }

          .case-information #docket-number {
            width: 50%;
            float: right;
            text-indent: 5px;
          }

          .clear {
            clear: both;
          }

          .us-tax-court-seal {
            width: 70px;
            height: 70px;
            margin-right: -70px;
            background: url('data:image/svg+xml;base64,PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA3MTkuOTkyIDcyMCIgaGVpZ2h0PSI3MjAiIHZpZXdCb3g9IjAgMCA3MTkuOTkyIDcyMCIgd2lkdGg9IjcxOS45OTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTMuMTAyIDM2MGMwLTE5Ny4xMTUgMTU5Ljc4My0zNTYuODk4IDM1Ni44OS0zNTYuODk4IDE5Ny4xMTEgMCAzNTYuODk4IDE1OS43ODMgMzU2Ljg5OCAzNTYuODk4IDAgMTk3LjExLTE1OS43ODcgMzU2Ljg5Ny0zNTYuODk3IDM1Ni44OTctMTk3LjEwOCAwLTM1Ni44OTEtMTU5Ljc4Ny0zNTYuODkxLTM1Ni44OTd6IiBmaWxsPSIjZmZmIi8+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIj48cGF0aCBkPSJtMy4xMDIgMzYwYzAtMTk3LjExNSAxNTkuNzgzLTM1Ni44OTggMzU2Ljg5LTM1Ni44OTggMTk3LjExMSAwIDM1Ni44OTggMTU5Ljc4MyAzNTYuODk4IDM1Ni44OTggMCAxOTcuMTEtMTU5Ljc4NyAzNTYuODk3LTM1Ni44OTcgMzU2Ljg5Ny0xOTcuMTA4IDAtMzU2Ljg5MS0xNTkuNzg3LTM1Ni44OTEtMzU2Ljg5N3oiIHN0cm9rZS13aWR0aD0iNi4yMDQ1Ii8+PHBhdGggZD0ibTE2LjQ4NiAzNjBjMC0xODkuNzMgMTUzLjgwNC0zNDMuNTM0IDM0My41MzMtMzQzLjUzNCAxODkuNzMgMCAzNDMuNTI5IDE1My44MDQgMzQzLjUyOSAzNDMuNTM0IDAgMTg5LjcyMi0xNTMuNzk5IDM0My41MjUtMzQzLjUyOSAzNDMuNTI1LTE4OS43MjkgMC0zNDMuNTMzLTE1My44MDMtMzQzLjUzMy0zNDMuNTI1eiIgc3Ryb2tlLXdpZHRoPSI0LjE5OTQiLz48cGF0aCBkPSJtMTE4LjIwNyAzNjBjMC0xMzMuNTU1IDEwOC4yNTgtMjQxLjgxMiAyNDEuODEyLTI0MS44MTIgMTMzLjU1MSAwIDI0MS44MDkgMTA4LjI1OCAyNDEuODA5IDI0MS44MTIgMCAxMzMuNTQyLTEwOC4yNTggMjQxLjgwOC0yNDEuODA5IDI0MS44MDgtMTMzLjU1NCAwLTI0MS44MTItMTA4LjI2Ni0yNDEuODEyLTI0MS44MDh6IiBzdHJva2Utd2lkdGg9IjguMzk4OCIvPjxwYXRoIGQ9Im0xMzIuMDgzIDM2MGMwLTEyNS44ODcgMTAyLjA1LTIyNy45MzcgMjI3LjkzNi0yMjcuOTM3IDEyNS44ODcgMCAyMjcuOTMzIDEwMi4wNSAyMjcuOTMzIDIyNy45MzcgMCAxMjUuODg2LTEwMi4wNDYgMjI3LjkyOS0yMjcuOTMzIDIyNy45MjktMTI1Ljg4NiAwLTIyNy45MzYtMTAyLjA0My0yMjcuOTM2LTIyNy45Mjl6IiBzdHJva2Utd2lkdGg9IjQuMTk5NCIvPjwvZz48cGF0aCBkPSJtMzg0LjA0NSA2ODkuMDE5LTE5LjY0OS0xNC40OTItMTkuODYgMTQuMjEyIDcuNzExLTIzLjE3My0xOS42NDUtMTQuNDkxIDI0LjQxOS4xNyA3LjcxMS0yMy4xNjIgNy4zNzMgMjMuMjc0IDI0LjQyLjE3OC0xOS44NTggMTQuMjA5eiIvPjxwYXRoIGQ9Im03NC45MzUgMjQxLjg0OC05LjY2NiAyOC42NDggMTAuODIgMy42NTIgOC44OC0yNi4zMTggOS4xIDMuMDY0LTguODgzIDI2LjMxOCAxMy4zMjUgNC40OTYgMTAuMS0yOS45MjQgOS4wOTcgMy4wNjQtMTMuODMgNDAuOTc5LTUxLjQzOS0xNy4zNDYgMTMuMzk5LTM5LjcwMnoiLz48cGF0aCBkPSJtMTE4LjM2MiAyMzMuNjMzIDUuODAxLTEwLjAzM2M0Ljg0OS04LjM4NS0xLjU3Mi0xNS44NTgtOS4yODctMjAuMzI0LTEzLjg3OS04LjAxNi0xOS4wMDItMS43MTktMjEuNTQzIDIuNjc3bC01LjcyIDkuODk4IDMwLjc0OSAxNy43ODIgOC4wMiA0Ljg1Ni01Ljc0NyA5LjkzOC00Ni45NzUtMjcuMTYzIDEyLjU5LTIxLjc5MWM5LjYxNi0xNi42MzIgMjUuMDgzLTEyLjI3MSAzMy45NzgtNy4xMjUgMTAuMDgxIDUuODI0IDIyLjE4MiAxOC40MTggMTIuNzY0IDM0LjcxbC02LjYxMSAxMS40MzJ6Ii8+PHBhdGggZD0ibTEwMC4xMyAzMTcuMzQ3LTEuNjg5IDExLjg1LTQ0LjIzNi00LjcwMS0yLjQ0IDE3LjEzNi05LjUwMy0xLjAxNSA2LjU2NC00Ni4xMTggOS41MTEgMS4wMDctMi40NDQgMTcuMTQzeiIvPjxwYXRoIGQ9Im0xNTYuNzQ3IDE2Ny41MDVjMi4xNjUgMi4xMTUgNy4zMDQgNS4xMzkgMTQuNzY2LTIuMTA2IDQuMDQzLTMuOTE5IDcuNjQ4LTkuMjA5IDMuNjUyLTEzLjMzMy0yLjk1MS0zLjA0NC02LjgxNi0uODcxLTEyLjA5OCAyLjM1MWwtNS4zMzMgMy4yOGMtOC4wMjQgNC45NDktMTUuNzczIDkuNzI0LTI0LjA5NSAxLjE1LTQuMjA2LTQuMzM3LTkuMTgyLTE0LjM3MSA0LjA5My0yNy4yNDcgMTIuNTI4LTEyLjE2IDIzLjQ3Mi03LjYwNiAyOC4xNjItMi44ODVsLTguMjA2IDcuOTU4Yy0xLjkxMy0xLjUxLTYuNTkxLTQuOTc2LTE0LjA1OCAyLjI2Ni0zLjI0OSAzLjE0OC02LjAxOCA4LjA1MS0yLjU5NCAxMS41NzkgMi45NDcgMy4wMzYgNi4yIDEuMTQyIDguMjc5LS4xMzJsMTIuMjMzLTcuMzM4YzYuODQ3LTQuMTE3IDE0LjA4MS02LjkxNyAyMC44NjYuMDg1IDExLjM3IDExLjcyMy0uMTYzIDI0LjkxMy0zLjc0OSAyOC4zOTQtMTQuOTI1IDE0LjQ3OS0yNS40MzYgOC43NzEtMzAuMTIxIDMuOTQyeiIvPjxwYXRoIGQ9Im05Ni43MjYgMzUwLjgyOS0uMTc4IDExLjgyNy01NC42NDYgMS41NDUuMTctMTEuODM0eiIvPjxwYXRoIGQ9Im04NS4xNzggNDMwLjg4NGMxMy44MDYtMy45MiAyMi42NjcgMi45MzIgMjcuMzQgMTYuNDc0IDEuNzA4IDQuOTQxIDMuMDc5IDEyLjYwMi0uNDU3IDE4Ljg2My0yLjIwNyAzLjgzLTYuMDU3IDYuMTUzLTExLjI1NyA3Ljc5NmwtMzQuNzU2IDkuODY3LTMuOTU0LTExLjQ1MSAzNC4wMjQtOS42NTRjNy4zMDQtMi4wNzIgOS4wMi03LjMyMyA3LjIwMy0xMi41NjYtMi42NTctNy43MDMtNy4zOTMtOS44MS0xMy43NTEtOC4wMDVsLTM0LjUzMiA5LjgwNi0zLjk2Mi0xMS40NTZ6Ii8+PHBhdGggZD0ibTQzLjMxNSAzODkuMjI5LTEuNDAyLTExLjA4NiA1My45NzItMy41ODIgMS40OTkgMTEuODgtMzUuNTQ2IDI1Ljc1Ny4wMTkuMTU2IDM4LjQ4Mi0yLjU1MyAxLjQwNiAxMS4wODgtNTMuOTczIDMuNTgyLTEuNTg0LTEyLjUxNyAzNC43My0yNS4wNTktLjAyLS4xNTl6Ii8+PHBhdGggZD0ibTIxOS4zNDMgMTM3LjY0LTkuOTAyIDYuNjEtMjQuODI3LTM3LjE0OS0xNC4zMjEgOS41NjgtNS4zMzItNy45ODUgMzguNTQzLTI1Ljc0OCA1LjMzNyA3Ljk4NS0xNC4zMjEgOS41Njl6Ii8+PHBhdGggZD0ibTI0My43NTIgMTAxLjEwOSAxMy4zODktNS42MzQtMTQuODQtMTcuMDM5LS4xNDUuMDYyIDEuNTk2IDIyLjYxMS43MDkgOS44NzIuNjc4IDExLjg0Ni0xMS41NTYgNC44NjQtMi4zMjMtNTcuODk1IDEyLjY1NS01LjMyNSAzOS41NTUgNDIuMjIzLTExLjkyNCA1LjAxOS03LjcwNi04Ljg5Ni0xOS4zNzkgOC4xNjR6Ii8+PHBhdGggZD0ibTMxMi4xNjUgMTAxLjAxMy0xMS42NTIgMi40NTktOS4yMDEtNDMuNzIyLTE2Ljg1NCAzLjU1NS0xLjk3OS05LjM5OCA0NS4zNi05LjU2NiAxLjk3OCA5LjM5OS0xNi44NTcgMy41NTF6Ii8+PHBhdGggZD0ibTM3NC4zNTIgNTEuNDUxLTMwLjIxOC43NzkuMjk0IDExLjQxNiAyNy43NjItLjcyLjI1MiA5LjYtMjcuNzY2LjcxNi4zNiAxNC4wNTggMzEuNTczLS44MTMuMjQ4IDkuNTk2LTQzLjIzOCAxLjExOS0xLjQwMS01NC4yNjYgNDEuODkzLTEuMDg5eiIvPjxwYXRoIGQ9Im0zOTUuMTIgODEuNjU4Yy0uNDA2IDIuOTk3LjIyOSA4LjkyMiAxMC40OTEgMTAuNjExIDUuNTY0LjkxIDExLjk1OC42NTQgMTIuODg4LTUuMDE1LjY4OS00LjE3NS0zLjM1Ny01Ljk4Ny05LjA5Ny04LjMwN2wtNS44MDUtMi4zMjhjLTguNzYtMy41MDgtMTcuMjE0LTYuODg1LTE1LjI4NS0xOC42NzMuOTgzLTUuOTY0IDYuMDc2LTE1LjkzMiAyNC4zMzEtMTIuOTM1IDE3LjIzMyAyLjgyNyAyMC4wOTEgMTQuMzIxIDE5LjA5MiAyMC45bC0xMS4yNzctMS44NDdjLjA3OC0yLjQ0NC4wNjYtOC4yNjgtMTAuMi05Ljk0OS00LjQ2MS0uNzMyLTEwLjA0NS0uMDM5LTEwLjg0MyA0LjgxLS42ODIgNC4xNzUgMi43NzIgNS42NjIgNS4wMzggNi41NzJsMTMuMTgzIDUuNDUzYzcuMzg1IDMuMDUyIDEzLjk0IDcuMTkxIDEyLjM2NSAxNi44MTUtMi42NDYgMTYuMTEtMjAuMTA3IDE0LjctMjUuMDQ1IDEzLjg5MS0yMC41MjQtMy4zNjUtMjIuMjAxLTE1LjIwOC0yMS4xMTMtMjEuODQ1eiIvPjxwYXRoIGQ9Im00NzUuNzUxIDEyMi42MDYtMTAuOTA5LTQuOTYgMjIuMjMyLTM4LjY1My0xNS43ODQtNy4xNzIgNC43NzEtOC4zMDYgNDIuNDkgMTkuMzA4LTQuNzc5IDguMzA3LTE1Ljc4NS03LjE3NnoiLz48cGF0aCBkPSJtNTI5LjMyNCAxMzEuNjkxIDcuOTg2LTIxLjEzNi0uMTI4LS4wODktMTkuNDc1IDEyLjkxMSAxMS42MTcgOC4zMTQtMy4yODMgOS4zNzItMTYuODIzLTEyLjAzNi0xMC4yNzQgNi42MzgtMTAuMDMtNy4xOCA1MC43MTYtMzEuNTg5IDEwLjk4MiA3Ljg2MS0xOC40MTQgNTQuNzEyLTEwLjM0Ny03LjQwOCA0LjE5LTEwLjk5OHoiLz48cGF0aCBkPSJtNTc0LjgzNSAyMDEuOTIxLTkuOTg3LTEwLjU1IDYuMDMzLTIwLjU3LTIxLjM2IDQuMzc2LTkuNTUtMTAuMDkzIDMyLjgwOC01LjY5MiA3LjMzLTMwLjg2OSA5Ljc2NyAxMC4zMTMtNS43NTggMTkuNDQxIDE5Ljg5LTQuNTA4IDkuNDM3IDkuOTc2LTMwLjg5MSA1LjMwMXoiLz48cGF0aCBkPSJtNjM0LjQxMSAyMzQuMTU2YzIuNDM5LTIuMzQ0IDcuMDI0LTYuNzkzIDIuNDc1LTE1LjUxOC0yLjY0Ni01LjA2NS05Ljc1MS0xMC44NDgtMjMuMzU5LTMuNzQ4LTguNjQ3IDQuNTA3LTE0LjU1NCAxMi4xNDQtOS44ODMgMjEuMDg2IDMuMDQgNS44NCA4LjMyMiA4LjI3NSAxNC44ODIgNi40NjdsNS41MTEgMTAuNTUzYy0xMS41NiAzLjM0Mi0yMi42MTEtLjAyLTI5LjIyMy0xMi42ODctNy4wMTMtMTMuNDQyLTMuMzkyLTI3LjU4OSAxMy4yMjYtMzYuMjU5IDE2LjgzLTguNzcxIDMwLjczMi0zLjA0NCAzNy41MjUgOS45NzIgNy44OTIgMTUuMTI2IDEuMTY1IDI2LjQxOS01LjY1IDMwLjY5NHoiLz48cGF0aCBkPSJtNjI0LjEyOSAyODkuMTdjMS42OTYgNi4yMDggNy43MjMgMTMuOTQxIDIyLjM3NiA5Ljk0NSAxNC42NTgtNC4wMDEgMTUuOTI4LTEzLjcyOSAxNC4yMzItMTkuOTMzLTEuNjg4LTYuMi03LjcxOS0xMy45MzQtMjIuMzgtOS45MzgtMTQuNjU0IDQuMDAyLTE1LjkxNyAxMy43My0xNC4yMjggMTkuOTI2bC05LjI2MyAyLjUyOWMtMS45ODItNy4yNzMtNC4yMTQtMjcuMjI5IDIwLjM1OC0zMy45MzkgMjQuNTc1LTYuNzAzIDMyLjc4OSAxMS42MjUgMzQuNzc1IDE4Ljg5NyAxLjk4MiA3LjI3NyA0LjIxNCAyNy4yMzItMjAuMzU4IDMzLjk0My0yNC41NzkgNi43MDQtMzIuNzkzLTExLjYyNS0zNC43NzUtMTguOTAxeiIvPjxwYXRoIGQ9Im02NDUuMzM2IDM2OC44OGMtMTQuMjcxLjc0Ny0yMC44NjYtNy45NjctMjEuNjIxLTIyLjMxNC0uMjc4LTUuMjI4LjUxOS0xMy4wNjIgNS42MTEtMTguNDE4IDMuMTUyLTMuMjY1IDcuNDc1LTQuNjg2IDEyLjg5OS01LjEzMWwzNS45MjctMS44OS42NDMgMTIuMTI5LTM1LjE3NSAxLjg1MWMtNy41NDguMzk5LTEwLjYzIDUuMTctMTAuMzM2IDEwLjcyLjQzNCA4LjE2MyA0LjM4OCAxMS4yOTIgMTAuOTUxIDEwLjk1MWwzNS43MTQtMS44ODYuNjM5IDEyLjEyOXoiLz48cGF0aCBkPSJtNjU0LjAwNiAzOTMuNTE3IDE0LjI0NCAxLjQyMi0yLjIwNCAxNC45MDFjLTEuMDM0IDcuMDEtNS4zODcgNy45NDYtOC4yMSA3LjY2OC01LjI2Ny0uNTI3LTYuODI3LTMuNzUzLTUuOTAxLTkuOTczbDIuMDcxLTE0LjAxOC04Ljk3Ny0uODk4LTEuODI3IDEyLjM1NGMtMS4zMSA4Ljg0Mi00LjE5NCA5LjAzOS0xMS40NjcgOC4zMTEtNS40OTEtLjU0Mi04LjMwNy0uMzQxLTEwLjk1Mi4yMDVsLTEuOTU1IDEzLjIyOSAxLjQxMy4xMzVjMS4yNjMtMi40NTkgMy4xOTUtMi4yNjUgMTAuOTgyLTEuNDkgOS45NDEuOTk1IDExLjk1MS0xLjM5NSAxNC41NzctNS44OTguOTQgNS44MzIgNS41MTggOS41MjMgMTEuMzgxIDEwLjEwNCA0LjU5Ny40NjEgMTUuNDc1LTEuMjgxIDE3LjcyNS0xNi40OTdsNC4yODMtMjguOTI0LTUzLjI3NC01LjMxNy0xLjczNSAxMS43MTEgMjAuODUgMi4wNzl6Ii8+PHBhdGggZD0ibTYwOC4yNTYgNDU1LjQ4MiA0LjAwOC0xMS4yNTcgNDIuNTM2IDEzLjIxMyA1Ljc5OC0xNi4yOTIgOS4xMzggMi44NDItMTUuNTkgNDMuODQ2LTkuMTQzLTIuODM5IDUuNzkzLTE2LjI5MnoiLz48cGF0aCBkPSJtMzAwLjQ4MSAyODEuMDYxYy0xNi44MTQgMi4xODEtMTQuMjI0IDYuMjc3LTE0LjIyNCAzNC45Mzh2NzEuMjU2YzAgMjEuODM0IDAgNzMuMTU3LTU2LjU2MiA3My4xNTctNTQuMTY3IDAtNTQuMTY3LTUzLjIzNi01NC4xNjctNjkuNjF2LTg1LjE3N2MwLTIwLjE5NiAyLjE5Ni0yMy4yMDEtMTQuNDA2LTI0LjU2NHYtNS4xODloNTYuNTU5djUuMTg5Yy0xNy4yNTIgMS42MzktMTkuODcgNS4xODYtMTkuODcgMjQuNTY0djg3LjM1NGMwIDE3LjQ3NyAwIDU1LjQyMSAzNy45OTQgNTUuNDIxIDE3LjA0IDAgMjkuNDgxLTguNzM3IDM1LjgxNy0yMS41NjYgMi44MzktNi4wMTEgNS4wMi0xNS4wMTUgNS4wMi0zNy4xMjd2LTczLjcwN2MwLTI5LjIxMS01LjIzNi0zMy44NS0yMC41MjUtMzQuOTM4di01LjE4OWg0NC4zNjR6Ii8+PHBhdGggZD0ibTU0Ny42OTIgMzMwLjE5NmgtNi44MTljLTQuNjQ0LTIyLjM4NC0yMi4xMTMtNDYuOTU1LTUwLjc4MS00Ni45NTUtMTMuNjQ3IDAtMjcuNTY5IDguNDYyLTI3LjU2OSAyNS4zODkgMCA0MC45NDggOTEuMTggNDYuNDA5IDkxLjE4IDEwMi4zNjggMCAyMy4yMDQtMTguNTY0IDQ5LjQxNC01Ny42MDEgNDkuNDE0LTIwLjc0OSAwLTM0LjEyOS05LjI4My00Mi4zMTUtOS4yODMtNS43MjggMC04LjQ2MiA0LjY0LTguNDYyIDkuMDA4aC02LjAwMmwtOC4xOTEtNTcuODc2aDYuMjc4YzUuMTg1IDEyLjgzIDE5LjEwNiA0OC4zMTggNTUuOTYyIDQ4LjMxOCAyMS44MzggMCAzMi43NjMtMTUuNTYgMzIuNzYzLTMwLjI5OSAwLTE1LjU1Ny00LjM3Ni0yNC44MzktNDQuNTA0LTQ4LjMxOC0yNS4xMTQtMTQuNDcyLTQyLjU4My0yNi40OC00Mi41ODMtNTMuNTA4IDAtMzEuMTE2IDI0LjgzOS00Ni40MDQgNDkuNDEtNDYuNDA0IDE2LjM3NyAwIDMxLjEyNCA5LjI3OCAzNy45NDMgOS4yNzggNy42NDUgMCA5LjAxMi02LjI3MyA5LjU1NC05LjI3OGg1LjczNXoiLz48cGF0aCBkPSJtMzU1Ljc1MSAxNjIuNDAxLS4xODktMjAuNjY0YzAtMi4zMzEgMS44ODItNC4yMTMgNC4yMTQtNC4yMTNoMy44NDFjMi4zMzIgMCA0LjIyMiAxLjg4MiA0LjIyMiA0LjIxM2wuMDM1IDIwLjY2NC4wODUgNC44MTdoOS4wM2MxLjI5OCAwIDEuNzQzLjg2NCAxLjc0MyAxLjcyNCAwIC44NjMuMDY5IDYuOTcxLjA2OSA2Ljk3MWw5LjE4OS0uMDI3LS4xMDgtMTEuNzM4YzAtNC4xOTQgMi4xLTQuMTk0IDIuMS00LjE5NGw5Ljk3Ni0uMDU4cy42MTUgNS45NzUgMS45MDUgNy4wNTZjMS4yOTcgMS4wNzMgNC4zMzcgMi4zODIgMTMuNzkgMi4zODJoNC40MDdzNC4yMDIgNi4zOSA0LjIwMiAxMS4xMTRjMCA0LjcxNy00LjIwMiAxMS4xMTQtNC4yMDIgMTEuMTE0aC00LjQwN2MtOS40NTMgMC0xMC4yMDQuNDkxLTEyLjQ5MyAxLjUxOS0yLjI4IDEuMDIxLTMuMDIxIDcuNzQ4LTMuMDIxIDcuNzQ4bC04LjM5Ni4xMDVjLTMuNjc5IDAtMy42NzktMi4wOTYtMy42NzktMi4wOTZsLS4wNzQtMTIuMTEzLTkuMTg5LS4wMjdzLS4wNjkgNi45Ny0uMDY5IDcuODMzYzAgLjg2NC0uNDQ1IDEuNzI0LTEuNzQzIDEuNzI0LTEuMjg5IDAtNS4xNSAwLTUuMTUgMHMtMS4wMTUtLjIzMS0xLjAxNSAxLjkyNWMwIDEuMDc2LS4wOTMgMTQtLjA5MyAxNGwuMDQ3IDMwMi45MzctLjAzMSA1NS4xMzhjMCAyLjMzMS0xLjg5NCA0LjIxNy00LjIyMSA0LjIxN2gtMy44NDJjLTIuMzMxIDAtNC4yMTgtMS44ODYtNC4yMTgtNC4yMTdsLS4wMjYtNTUuMTM4LTUuNDkyLTMwMi45MzdjLjEwNC01LjkyNi0uMTMxLTExLjcxOS0uMTQzLTE0LjIzNi0uMDEyLTIuMjY2LTEuMjEzLTEuNzMtMS4yMTMtMS43My0yLjk1OC0uMjYtNC40MS0uMTI1LTYuOTctLjAzMS0xNy45MzguNjQ2LTI3LjAyIDkuMjc1LTMzLjQyNSAxOS40NTEtNC45NTctNy41MzktOC40MTktMTYuOTU3LTguMzg0LTM0Ljk2OS4wMzgtMTguMTAxIDQuOTM0LTI2LjMxNCA4LjM4NC0zMS42OTMgNi4yNSAxMS44NDYgMjEuNTc4IDE4LjQxIDMyLjc3NyAxOC4zNzIgMy4wMTctLjAxMiAxMS43MzggMCAxMS43MzggMHoiLz48cGF0aCBkPSJtMzU1Ljc1MSAxNjIuNDAxLS4xODktMjAuNjY0YzAtMi4zMzEgMS44ODItNC4yMTMgNC4yMTQtNC4yMTNoMy44NDFjMi4zMzIgMCA0LjIyMiAxLjg4MiA0LjIyMiA0LjIxM2wuMDM1IDIwLjY2NC4wODUgNC44MTdoOS4wM2MxLjI5OCAwIDEuNzQzLjg2NCAxLjc0MyAxLjcyNCAwIC44NjMuMDY5IDYuOTcxLjA2OSA2Ljk3MWw5LjE4OS0uMDI3LS4xMDgtMTEuNzM4YzAtNC4xOTQgMi4xLTQuMTk0IDIuMS00LjE5NGw5Ljk3Ni0uMDU4cy42MTUgNS45NzUgMS45MDUgNy4wNTZjMS4yOTcgMS4wNzMgNC4zMzcgMi4zODIgMTMuNzkgMi4zODJoNC40MDdzNC4yMDIgNi4zOSA0LjIwMiAxMS4xMTRjMCA0LjcxNy00LjIwMiAxMS4xMTQtNC4yMDIgMTEuMTE0aC00LjQwN2MtOS40NTMgMC0xMC4yMDQuNDkxLTEyLjQ5MyAxLjUxOS0yLjI4IDEuMDIxLTMuMDIxIDcuNzQ4LTMuMDIxIDcuNzQ4bC04LjM5Ni4xMDVjLTMuNjc5IDAtMy42NzktMi4wOTYtMy42NzktMi4wOTZsLS4wNzQtMTIuMTEzLTkuMTg5LS4wMjdzLS4wNjkgNi45Ny0uMDY5IDcuODMzYzAgLjg2NC0uNDQ1IDEuNzI0LTEuNzQzIDEuNzI0LTEuMjg5IDAtNS4xNSAwLTUuMTUgMHMtMS4wMTUtLjIzMS0xLjAxNSAxLjkyNWMwIDEuMDc2LS4wOTMgMTQtLjA5MyAxNGwuMDQ3IDMwMi45MzctLjAzMSA1NS4xMzhjMCAyLjMzMS0xLjg5NCA0LjIxNy00LjIyMSA0LjIxN2gtMy44NDJjLTIuMzMxIDAtNC4yMTgtMS44ODYtNC4yMTgtNC4yMTdsLS4wMjYtNTUuMTM4LTUuNDkyLTMwMi45MzdjLjEwNC01LjkyNi0uMTMxLTExLjcxOS0uMTQzLTE0LjIzNi0uMDEyLTIuMjY2LTEuMjEzLTEuNzMtMS4yMTMtMS43My0yLjk1OC0uMjYtNC40MS0uMTI1LTYuOTctLjAzMS0xNy45MzguNjQ2LTI3LjAyIDkuMjc1LTMzLjQyNSAxOS40NTEtNC45NTctNy41MzktOC40MTktMTYuOTU3LTguMzg0LTM0Ljk2OS4wMzgtMTguMTAxIDQuOTM0LTI2LjMxNCA4LjM4NC0zMS42OTMgNi4yNSAxMS44NDYgMjEuNTc4IDE4LjQxIDMyLjc3NyAxOC4zNzIgMy4wMTctLjAxMiAxMS43MzggMCAxMS43MzggMHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIzLjQ0NjkiLz48cGF0aCBkPSJtMzg4LjE5NiAxNzcuMjEzdjcuNzU3bS05LjQ4LTcuNzU3djcuNzU3bS0yMi40MDQtMTcuNjY2aDEwLjc2N20tMTMuMzUzIDI4Ljg2NmgxNi4zNyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iMi42ODUyIi8+PHBhdGggZD0ibTMzNC4wMzQgMjEyLjYwOWMtNy4zMjcgMC03LjQ3MSA1LjE2Ni03LjQ3MSA3LjEwMiAwIDEuOTM3LjEyIDcuNDc1IDEwLjA5MiA3LjQ3NWwxLjE4Mi0uNTMxYzQuMjAyIDAgOC4yNzEgMS44NCA4LjI3MSAxLjg0czEyLjMzMS0zLjQwOCAxOS45NDQgMGMwIDAgNi41NjMtMy4xNDggMTkuOTUxIDBsMi44ODUtMS4zMDljOS45NzcgMCAxMC4wOTMtNS41MzggMTAuMDkzLTcuNDc1IDAtMS45MzYtLjE0NC03LjEwMi03LjQ2Ny03LjEwMi02LjkgMC01Ny40OCAwLTU3LjQ4IDB6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0ibTMzNC4wMzQgMjEyLjYwOWMtNy4zMjcgMC03LjQ3MSA1LjE2Ni03LjQ3MSA3LjEwMiAwIDEuOTM3LjEyIDcuNDc1IDEwLjA5MiA3LjQ3NWwxLjE4Mi0uNTMxYzQuMjAyIDAgOC4yNzEgMS44NCA4LjI3MSAxLjg0czEyLjMzMS0zLjQwOCAxOS45NDQgMGMwIDAgNi41NjMtMy4xNDggMTkuOTUxIDBsMi44ODUtMS4zMDljOS45NzcgMCAxMC4wOTMtNS41MzggMTAuMDkzLTcuNDc1IDAtMS45MzYtLjE0NC03LjEwMi03LjQ2Ny03LjEwMi02LjkgMC01Ny40OCAwLTU3LjQ4IDB6IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iNC4xOTk0Ii8+PHBhdGggZD0ibTM3My40MjIgNTY2LjA3MWMyLjMzMSAwIDQuMjE4LTEuODkgNC4yMTgtNC4yMjF2LTQuMDU5YzAtMi4zMzEtMS44ODctNC4yMjItNC4yMTgtNC4yMjJoLTE3Ljg0OWMtMi4zMzEgMC00LjIxMyAxLjg5MS00LjIxMyA0LjIyMnY0LjA1OWMwIDIuMzMxIDEuODgyIDQuMjIxIDQuMjEzIDQuMjIxeiIvPjxwYXRoIGQ9Im0zNzMuNDIyIDU2Ni4wNzFjMi4zMzEgMCA0LjIxOC0xLjg5IDQuMjE4LTQuMjIxdi00LjA1OWMwLTIuMzMxLTEuODg3LTQuMjIyLTQuMjE4LTQuMjIyaC0xNy44NDljLTIuMzMxIDAtNC4yMTMgMS44OTEtNC4yMTMgNC4yMjJ2NC4wNTljMCAyLjMzMSAxLjg4MiA0LjIyMSA0LjIxMyA0LjIyMXoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIzLjQ0NjkiLz48cGF0aCBkPSJtMzcwLjUxIDE0NS45MTljMi4zMzEgMCA0LjIyMiAxLjg5NCA0LjIyMiA0LjIyMXY0LjA1OWMwIDIuMzMyLTEuODkxIDQuMjE3LTQuMjIyIDQuMjE3aC0xNy44NDFjLTIuMzMxIDAtNC4yMjUtMS44ODYtNC4yMjUtNC4yMTd2LTQuMDU5YzAtMi4zMjcgMS44OTQtNC4yMjEgNC4yMjUtNC4yMjF6Ii8+PHBhdGggZD0ibTM3MC41MSAxNDUuOTE5YzIuMzMxIDAgNC4yMjIgMS44OTQgNC4yMjIgNC4yMjF2NC4wNTljMCAyLjMzMi0xLjg5MSA0LjIxNy00LjIyMiA0LjIxN2gtMTcuODQxYy0yLjMzMSAwLTQuMjI1LTEuODg2LTQuMjI1LTQuMjE3di00LjA1OWMwLTIuMzI3IDEuODk0LTQuMjIxIDQuMjI1LTQuMjIxeiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjMuNDQ2OSIvPjxwYXRoIGQ9Im0zNjEuODU4IDUxNy40NzlzLTE1LjIyNyAyLjEwMy0xNi44MDMgMHYtMjkxLjA4M3M5LjcxMi0yLjA5NSAxNi44MDMgMHoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJtMzYxLjg1OCA1MTcuNDc5cy0xNS4yMjcgMi4xMDMtMTYuODAzIDB2LTI5MS4wODNzOS43MTItMi4wOTUgMTYuODAzIDB6IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iNC4xOTg0Ii8+PHBhdGggZD0ibTM0NS4wNTYgNTE3LjQ3OXMtMTUuMjI0IDIuMTAzLTE2Ljc5NiAwdi0yOTEuMDgzczkuNzA1LTIuMDk1IDE2Ljc5NiAweiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Im0zNDUuMDU2IDUxNy40NzlzLTE1LjIyNCAyLjEwMy0xNi43OTYgMHYtMjkxLjA4M3M5LjcwNS0yLjA5NSAxNi43OTYgMHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSI0LjE5ODQiLz48cGF0aCBkPSJtMzI4LjI2IDIyNi4zOTZjLTEwLjc2Mi0zLjE0OC0xOS4xNTcuNzktMTkuMTU3Ljc5djI5MC4yOTNzMTIuMDY2IDMuMTU2IDE5LjE1NyAweiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Im0zMjguMjYgMjI2LjM5NmMtMTAuNzYyLTMuMTQ4LTE5LjE1Ny43OS0xOS4xNTcuNzl2MjkwLjI5M3MxMi4wNjYgMy4xNTYgMTkuMTU3IDB6IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iNC4xOTg0Ii8+PHBhdGggZD0ibTM3OC42NTQgNTE3LjQ3OXMtMTUuMjI4IDIuMTAzLTE2Ljc5NiAwdi0yOTEuMDgzczkuNzA1LTIuMDk1IDE2Ljc5NiAweiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Im0zNzguNjU0IDUxNy40NzlzLTE1LjIyOCAyLjEwMy0xNi43OTYgMHYtMjkxLjA4M3M5LjcwNS0yLjA5NSAxNi43OTYgMHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSI0LjE5ODQiLz48cGF0aCBkPSJtMzk1LjQ1MyA1MTcuNDc5cy0xNS4yMjMgMi4xMDMtMTYuNzk5IDB2LTI5MS4wODNzOS43MTItMi4wOTUgMTYuNzk5IDB6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0ibTM5NS40NTMgNTE3LjQ3OXMtMTUuMjIzIDIuMTAzLTE2Ljc5OSAwdi0yOTEuMDgzczkuNzEyLTIuMDk1IDE2Ljc5OSAweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjQuMTk4NCIvPjxwYXRoIGQ9Im00MTIuMjQ5IDUxNy40NzlzLTE1LjIyNCAyLjEwMy0xNi43OTYgMHYtMjkxLjA4M3M5LjcwOS0yLjA5NSAxNi43OTYgMHoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJtNDEyLjI0OSA1MTcuNDc5cy0xNS4yMjQgMi4xMDMtMTYuNzk2IDB2LTI5MS4wODNzOS43MDktMi4wOTUgMTYuNzk2IDB6IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iNC4xOTg0Ii8+PHBhdGggZD0ibTMwNi45OTkgMjMwLjg2cy01Ljc3NyAxMC40OTkuNTIzIDI2LjI0NWMwIDAgODMuOTkyIDM3LjI3NyAxMDQuNDY3IDQyLjUxNyAwIDAgNC43MjUtMjQuMTQ2LjUyMi0yOC4zNC4wMDEgMC0xMDIuODg2LTQxLjQ3MS0xMDUuNTEyLTQwLjQyMnoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJtMzA2Ljk5OSAyMzAuODZzLTUuNzc3IDEwLjQ5OS41MjMgMjYuMjQ1YzAgMCA4My45OTIgMzcuMjc3IDEwNC40NjcgNDIuNTE3IDAgMCA0LjcyNS0yNC4xNDYuNTIyLTI4LjM0LjAwMSAwLTEwMi44ODYtNDEuNDcxLTEwNS41MTItNDAuNDIyeiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjQuMTk5NCIvPjxwYXRoIGQ9Im0zMDcuNTIyIDQzNC41MzVzLTMuMTQ4IDkuNDUzLjUyNiAyNC4xNTNjMCAwIDkyLjM5MyAzNS4xNjcgMTA0Ljk4NiAzNy4yNyAwIDAgOC40MDMtMTEuNTQ4LjUzLTI0LjY2OC4wMDEgMC05OC42ODgtMzguODUtMTA2LjA0Mi0zNi43NTV6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0ibTMwNy41MjIgNDM0LjUzNXMtMy4xNDggOS40NTMuNTI2IDI0LjE1M2MwIDAgOTIuMzkzIDM1LjE2NyAxMDQuOTg2IDM3LjI3IDAgMCA4LjQwMy0xMS41NDguNTMtMjQuNjY4LjAwMSAwLTk4LjY4OC0zOC44NS0xMDYuMDQyLTM2Ljc1NXoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSI0LjE5OTQiLz48cGF0aCBkPSJtNDExLjk4OSA0MzIuNDRzNS4yNDcgMTYuNzk1LjUyMiAyNi43NzFjMCAwLTk2LjU5IDQ4LjI5OS0xMDQuNDYzIDQ2LjcyNCAwIDAtNS4yNTEtMTcuODUtMS41OC0yMS41MjQuMDAxLS4wMDEgNDUuMTUxLTI0LjE1IDEwNS41MjEtNTEuOTcxeiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Im00MTEuOTg5IDQzMi40NHM1LjI0NyAxNi43OTUuNTIyIDI2Ljc3MWMwIDAtOTYuNTkgNDguMjk5LTEwNC40NjMgNDYuNzI0IDAgMC01LjI1MS0xNy44NS0xLjU4LTIxLjUyNC4wMDEtLjAwMSA0NS4xNTEtMjQuMTUgMTA1LjUyMS01MS45NzF6IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iNC4xOTk0Ii8+PHBhdGggZD0ibTMwOC41NzEgMjc5LjY4M3MtOS40NDQgMTQuMTY5IDAgMjMuMDk2YzAgMCA4My45ODktMzkuMzc3IDEwMi44OTItNTIuNDkzIDAgMCA3LjM1LTI5LjkyNC0zLjY3Ni0yNS4xOTkgMC0uMDAxLTkyLjM4OCA0OC44MjEtOTkuMjE2IDU0LjU5NnoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJtMzA4LjU3MSAyNzkuNjgzcy05LjQ0NCAxNC4xNjkgMCAyMy4wOTZjMCAwIDgzLjk4OS0zOS4zNzcgMTAyLjg5Mi01Mi40OTMgMCAwIDcuMzUtMjkuOTI0LTMuNjc2LTI1LjE5OSAwLS4wMDEtOTIuMzg4IDQ4LjgyMS05OS4yMTYgNTQuNTk2eiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjQuMTk5NCIvPjxwYXRoIGQ9Im0zMDUuODE0IDIzNS41ODVzLTIuMDk5IDYuODI3LTEuMDQ2IDEyLjA3NWMwIDAtLjUyMi0zLjE1MiAyLjA5Ni0zLjE1MiAyLjYyNSAwIDE0LjcgNS4yNDcgMjQuNjc2IDguNDAzIDAgMC0yMi4wNTEtNi44MjctMjQuMTQ2LTExLjAyOS0yLjEwMi00LjE5OC0xLjU4LTYuMjk3LTEuNTgtNi4yOTd6Ii8+PHBhdGggZD0ibTMwNS44MTQgMjM1LjU4NXMtMi4wOTkgNi44MjctMS4wNDYgMTIuMDc1YzAgMC0uNTIyLTMuMTUyIDIuMDk2LTMuMTUyIDIuNjI1IDAgMTQuNyA1LjI0NyAyNC42NzYgOC40MDMgMCAwLTIyLjA1MS02LjgyNy0yNC4xNDYtMTEuMDI5LTIuMTAyLTQuMTk4LTEuNTgtNi4yOTctMS41OC02LjI5N3oiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIuMzEzNyIvPjxwYXRoIGQ9Im00MTMuMjA1IDI5Mi44NzZzMS45NzUtNi44NTguODM3LTEyLjA5YzAgMCAuNTg0IDMuMTQxLTIuMDQxIDMuMTg3LTIuNjI2LjA0Ny0xNC43OTQtNC45OTEtMjQuODE5LTcuOTcgMCAwIDIyLjE2NiA2LjQ0IDI0LjM0MyAxMC42MDQgMi4xNjQgNC4xNjMgMS42OCA2LjI2OSAxLjY4IDYuMjY5eiIvPjxwYXRoIGQ9Im00MTMuMjA1IDI5Mi44NzZzMS45NzUtNi44NTguODM3LTEyLjA5YzAgMCAuNTg0IDMuMTQxLTIuMDQxIDMuMTg3LTIuNjI2LjA0Ny0xNC43OTQtNC45OTEtMjQuODE5LTcuOTcgMCAwIDIyLjE2NiA2LjQ0IDI0LjM0MyAxMC42MDQgMi4xNjQgNC4xNjMgMS42OCA2LjI2OSAxLjY4IDYuMjY5eiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9Ii4zMTM3Ii8+PHBhdGggZD0ibTMwNi4yOTkgNDQxLjg1NHMtLjcyNSA0LjgxLjU2NSAxMC4wMDdjMCAwLS42Ny0zLjEyMSAxLjk0Ny0zLjI0NSAyLjYyNi0uMTIgMTQuOTMzIDQuNTU0IDI1LjA0NCA3LjIzNyAwIDAtMjIuMzQ1LTUuNzg1LTI0LjYzNy05Ljg4My0yLjI5Ni00LjA5Ni0yLjkxOS00LjExNi0yLjkxOS00LjExNnoiLz48cGF0aCBkPSJtMzA2LjI5OSA0NDEuODU0cy0uNzI1IDQuODEuNTY1IDEwLjAwN2MwIDAtLjY3LTMuMTIxIDEuOTQ3LTMuMjQ1IDIuNjI2LS4xMiAxNC45MzMgNC41NTQgMjUuMDQ0IDcuMjM3IDAgMC0yMi4zNDUtNS43ODUtMjQuNjM3LTkuODgzLTIuMjk2LTQuMDk2LTIuOTE5LTQuMTE2LTIuOTE5LTQuMTE2eiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9Ii4zMTM3Ii8+PHBhdGggZD0ibTM4Mi41MDcgNDczLjc2OWMyLjYyNi4wMiA1LjIxNyAxLjY2NSAxNS4xNzMgNC44NjQgMCAwLTkuNDA2LTEuNjk2LTExLjQ4Ni01LjkxeiIvPjxwYXRoIGQ9Im0zODIuNTA3IDQ3My43NjljMi42MjYuMDIgNS4yMTcgMS42NjUgMTUuMTczIDQuODY0IDAgMC05LjQwNi0xLjY5Ni0xMS40ODYtNS45MXoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIuMzEzNyIvPjxwYXRoIGQ9Im00MTMuOTE0IDQ0Ny42MjlzLS40OC00LjY4Ny0uMzQ5LTcuODM1YzAgMC0xLjMyOCAzLjQ5My0yLjg1NCA1LjYzNS42ODItLjk0OC02LjcyNyA1LjM4Ny0xOC41MyAxMC40OTkgMCAwIDE1LjQ3NS03LjczNyAxNi42OTEtOC41NTEgMy45MDctMi42MDMgNS4wNDIuMjUyIDUuMDQyLjI1MnoiLz48cGF0aCBkPSJtNDEzLjkxNCA0NDcuNjI5cy0uNDgtNC42ODctLjM0OS03LjgzNWMwIDAtMS4zMjggMy40OTMtMi44NTQgNS42MzUuNjgyLS45NDgtNi43MjcgNS4zODctMTguNTMgMTAuNDk5IDAgMCAxNS40NzUtNy43MzcgMTYuNjkxLTguNTUxIDMuOTA3LTIuNjAzIDUuMDQyLjI1MiA1LjA0Mi4yNTJ6IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iLjMxMzciLz48L3N2Zz4=');
            background-size: contain;
            float: left;
          }

          @page {
            margin-bottom: 55px;
          }

          @page :first {
            margin-top: 0;
          }
          ${options.styles || ''}
        </style>
      </head>
      <body>
        <div class="main">
          ${
            options.overwriteMain
              ? content.main
              : `
          <div class="court-header">
            <div class="us-tax-court-seal"></div>
            <h1>United States Tax Court</h1>
            ${options.h2 ? '<h2>' + options.h2 + '</h2>' : ''}
            <div class="clear"></div>
          </div>

          <div class="case-information">
            <div id="caption">${content.caption} ${content.captionPostfix}</div>
            <div id="docket-number">Docket Number: ${
              content.docketNumberWithSuffix
            }</div>
            <div class="clear"></div>
          </div>
          ${options.h3 ? '<h3>' + options.h3 + '</h3>' : ''}
          ${content.main}`
          }
        </div>
      </body>
    </html>`;
};

/**
 * HTML template generator for printable change of address/telephone PDF views
 *
 * @param {object} content content to be injected into the template
 * @returns {string} hydrated HTML content in string form
 */
const generateChangeOfAddressTemplate = content => {
  const {
    caption,
    captionPostfix,
    docketNumberWithSuffix,
    documentTitle,
    name,
    newData,
    oldData,
  } = content;

  let oldAddress = '';
  let newAddress = '';

  if (documentTitle === 'Notice of Change of Telephone Number') {
    oldAddress = `<div>${oldData.phone}</div>`;
    newAddress = `<div>${newData.phone}</div>`;
  } else {
    if (oldData.inCareOf) {
      oldAddress += `<div>c/o ${oldData.inCareOf}</div>`;
    }

    if (newData.inCareOf) {
      newAddress += `<div>c/o ${newData.inCareOf}</div>`;
    }

    oldAddress += `<div>${oldData.address1}</div>`;
    newAddress += `<div>${newData.address1}</div>`;

    if (oldData.address2) {
      oldAddress += `<div>${oldData.address2}</div>`;
    }

    if (newData.address2) {
      newAddress += `<div>${newData.address2}</div>`;
    }

    if (oldData.address3) {
      oldAddress += `<div>${oldData.address3}</div>`;
    }

    if (newData.address3) {
      newAddress += `<div>${newData.address3}</div>`;
    }

    oldAddress += `<div>${oldData.city}, ${oldData.state} ${oldData.postalCode}</div>`;
    newAddress += `<div>${newData.city}, ${newData.state} ${newData.postalCode}</div>`;

    if (oldData.country) {
      oldAddress += `<div>${oldData.country}</div>`;
    }

    if (newData.country) {
      newAddress += `<div>${newData.country}</div>`;
    }

    if (documentTitle === 'Notice of Change of Address and Telephone Number') {
      oldAddress += `<div style="margin-top:8px;">${oldData.phone}</div>`;
      newAddress += `<div style="margin-top:8px;">${newData.phone}</div>`;
    }
  }

  const main = `
    <p class="please-change">
      Please change the contact information for ${name} on the records of the Court.
    </p>
    <div>
      <table>
        <thead>
          <tr>
            <th>Old Contact Information</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              ${oldAddress}
            </td>
          </tr>
        </tbody>
      </table>
      <br /><br />
      <table>
        <thead>
          <tr>
            <th>New Contact Information</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              ${newAddress}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  const styles = `
    .please-change {
      margin-bottom: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    th, td {
      font-size: 10px;
    }
    th {
      font-weight: 600;
    }
    .case-information #caption {
      line-height:18px;
    }
  `;

  const templateContent = {
    caption,
    captionPostfix,
    docketNumberWithSuffix,
    main,
  };

  const options = {
    h3: documentTitle,
    styles,
    title: 'Change of Contact Information',
  };

  return generateHTMLTemplateForPDF(templateContent, options);
};

/**
 * HTML template generator for printable docket record PDF views
 *
 * @param {object} content content to be injected into the template
 * @returns {string} hydrated HTML content in string form
 */
const generatePrintableDocketRecordTemplate = content => {
  const {
    caption,
    captionPostfix,
    docketNumberWithSuffix,
    docketRecord,
    partyInfo,
  } = content;

  const styles = `
    .party-info {
      border: 1px solid #ccc;
      margin: 15px 0 30px 0;
    }

    .party-info-header {
      padding: 10px;
      border-bottom: 1px solid #ccc;
      background: #f0f0f0;
      font-size: 10px;
      font-weight: bold;
    }

    .party-info-content {
      display: flex;
      flex-flow: row wrap;
      align-items: flex-start;
      padding: 0 10px 10px 10px;
    }

    .party-details {
      width: 25%;
    }

    .docket-record-table {
      margin-top: 30px;
    }
  `;

  const templateContent = {
    caption,
    captionPostfix,
    docketNumberWithSuffix,
    main: `
    ${partyInfo}
    <div class="docket-record">${docketRecord}</div>
  `,
  };
  const options = {
    h2: 'Docket Record',
    styles,
    title: 'Docket Record',
  };

  return generateHTMLTemplateForPDF(templateContent, options);
};

const generateTrialCalendarTemplate = content => {
  const {
    caption,
    captionPostfix,
    docketNumberWithSuffix,
    documentTitle,
    formattedTrialSessionDetails,
    openCases,
  } = content;

  const renderCases = item => {
    return `<tr>
      <td style="width: 13%;" class="valign-top">
        ${item.docketNumberWithSuffix}
      </td>
      <td class="line-height-13">${item.caseCaption}</td>
      <td style="width: 25%;" class="line-height-13">
        ${item.practitioners
          .map(practitioner => practitioner.name)
          .join('<br />')}
      </td>
      <td style="width: 25%;" class="line-height-13">
        ${item.respondents.map(respondent => respondent.name).join('<br />')}
      </td>
    </tr>`;
  };

  const renderTrialCalendar = () => {
    return `
      <div class="court-header">
        <div class="us-tax-court-seal"></div>
        <h1 class="mb-1 text-center">United States Tax Court</h1>
        <h2 class="text-center">${
          formattedTrialSessionDetails.trialLocation
        }</h2>
        <h3 class="text-center">
          ${formattedTrialSessionDetails.formattedStartDateFull}
          ${formattedTrialSessionDetails.sessionType}
        </h3>
      </div>

      <div class="grid-container-main">
        <div class="panel">
          <div class="header">
            Trial Information
          </div>

          <div class="content grid-container">
            <div class="pr-1">
              <h4>Start Time</h4>
              <p>${formattedTrialSessionDetails.formattedStartTime}</p>
            </div>
            <div class="pr-1">
              <h4>Location</h4>
              ${
                formattedTrialSessionDetails.noLocationEntered
                  ? '<p>No location entered</p>'
                  : ''
              }
              <p>${formattedTrialSessionDetails.courthouseName || ''}</p>
              <p>
                <span class="address-line">
                  ${formattedTrialSessionDetails.address1 || ''}
                </span>
                <span class="address-line">
                  ${formattedTrialSessionDetails.address2 || ''}
                </span>
                <span class="address-line">
                  ${formattedTrialSessionDetails.formattedCityStateZip || ''}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div></div>
        <div class="panel">
          <div class="header">
            Assignments
          </div>
          <div class="content grid-container">
            <div class="pr-1">
              <h4>Judge</h4>
              <p class="mb-2">${formattedTrialSessionDetails.formattedJudge}</p>

              <h4>Court Reporter</h4>
              <p>${formattedTrialSessionDetails.formattedCourtReporter}</p>
            </div>
            <div class="pr-1">
              <h4>Trial Clerk</h4>
              <p class="mb-2">${
                formattedTrialSessionDetails.formattedTrialClerk
              }</p>

              <h4>IRS Calendar Administrator</h4>
              <p>${
                formattedTrialSessionDetails.formattedIrsCalendarAdministrator
              }</p>
            </div>
          </div>
        </div>
      </div>

      <div class="panel mb-4">
        <div class="header">
          Session Notes
        </div>
        <div class="content notes">
          <p>${formattedTrialSessionDetails.notes || ''}</p>
        </div>
      </div>

      <h3 class="open-cases bold">Open Cases (${openCases.length})</h3>

      <table>
        <thead>
          <tr>
            <th>Docket No.</th>
            <th>Case Name</th>
            <th>Petitioner Counsel</th>
            <th>Respondent Counsel</th>
          </tr>
        </thead>
        <tbody>
          ${openCases.map(renderCases).join('')}
        </tbody>
      </table>
    `;
  };

  const main = renderTrialCalendar();

  const templateContent = {
    caption,
    captionPostfix,
    docketNumberWithSuffix,
    main,
  };

  const options = {
    h3: documentTitle,
    overwriteMain: true,
    styles: `
      body {
        margin: 35px 50px 10px 50px;
        font-family: sans-serif;
        font-size: 10px;
      }

      h1 {
        padding-top: 10px;
        margin-bottom: 0px;
        font-size: 24px;
        line-height: 15px;
      }

      h2 {
        margin-top: 0px;
        /* padding-bottom: 15px; */
        font-size: 20px;
        font-weight: normal;
      }

      h3 {
        margin-top: 0px;
        font-family: sans-serif;
        font-size: 14px;
        font-weight: normal;
      }

      .bold {
        font-weight: bold;
      }

      .text-center {
        text-align: center;
      }

      table {
        width: 100%;
        border: 1px solid #ccc;
        -webkit-border-horizontal-spacing: 0px;

        border-spacing: 0;
        -webkit-border-vertical-spacing: 0px;
      }

      th,
      td {
        border-bottom: 1px solid #ccc;
        text-align: left;
        vertical-align: top;
      }

      td {
        padding: 12px 8px;
        line-height: 13px;
        vertical-align: top;
      }

      th {
        padding: 8px 10px 10px 8px;
        white-space: nowrap;
      }

      th {
        background-color: #f0f0f0;
      }

      .grid-container {
        display: grid;
        grid-gap: 10px;
        grid-template-columns: 50% 50%;
      }

      .grid-container-main {
        display: grid;
        grid-template-columns: 49% 2% 49%;
      }

      .mb-1 {
        margin-bottom: 10px;
      }

      .mb-2 {
        margin-bottom: 20px;
      }

      h4 {
        margin-bottom: 0px;
      }

      p {
        margin-top: 4px;
      }

      .address-line {
        display: block;
      }

      .court-header {
        margin-bottom: 30px;
        font-family: serif;
      }

      .panel {
        border: 1px solid #ccc;
        margin: 15px 0 5px 0;
      }

      .header {
        padding: 8px 10px;
        border-bottom: 1px solid #ccc;
        background: #f0f0f0;
        font-size: 10px;
        font-weight: bold;
      }

      .open-cases {
        font-size: 12px;
      }

      .content {
        min-height: 15px;
        padding: 0 10px 10px 10px;
      }

      .content.notes {
        padding-top: 12px;
      }

      .mb-4 {
        margin-bottom: 40px;
      }

      .pr-1 {
        padding-right: 10px;
      }

      @page {
        margin-bottom: 55px;
      }

      @page :first {
        margin-top: 0;
      }
    `,
    title: 'Change of Contact Information',
  };

  return generateHTMLTemplateForPDF(templateContent, options);
};

const generatePrintableFilingReceiptTemplate = content => {
  const {
    caption,
    captionPostfix,
    docketNumberWithSuffix,
    documentsFiledContent,
    filedAt,
    filedBy,
  } = content;

  const templateContent = {
    caption,
    captionPostfix,
    docketNumberWithSuffix,
    main: `
    <div class="filing-info">
      <div class="filed-by">Filed by ${filedBy}</div>
      <div class="filed-at">Filed ${filedAt}</div>
    </div>
    <div class="clear"></div>
    <div class="grid-container-main">
      <div class="panel">
        <div class="header">
          Documents Filed
        </div>
        <div class="content grid-container">${documentsFiledContent}</div>
      </div>
    </div>
  `,
  };

  const options = {
    h3: 'Receipt of Filing',
    styles: `
      .filing-info {
        margin: 10px 0;
      }

      .filed-by {
        width: 50%;
        float: left;
      }

      .filed-at {
        width: 50%;
        float: right;
        text-align: right;
      }

      h4.document-includes-header {
        margin-bottom: 5px;
        padding-bottom: 0;
      }

      .included {
        margin: 5px 0px;
      }

      hr {
        margin: 12px 0px 8px 0px;
      }
    `,
    title: 'Receipt of Filing',
  };

  return generateHTMLTemplateForPDF(templateContent, options);
};

const generateTrialSessionPlanningReportTemplate = content => {
  const { previousTerms, rows, selectedTerm, selectedYear } = content;

  const contentRows = rows.map(row => {
    return `
      <tr>
        <td>${row.stateAbbreviation}</td>
        <td>${row.trialCityState}</td>
        <td>${row.allCaseCount}</td>
        <td>${row.smallCaseCount}</td>
        <td>${row.regularCaseCount}</td>
        <td>${row.previousTermsData[0].join('<br />') ||
          '<div class="calendar-icon"></div>'}</td>
        <td>${row.previousTermsData[1].join('<br />') ||
          '<div class="calendar-icon"></div>'}</td>
        <td>${row.previousTermsData[2].join('<br />') ||
          '<div class="calendar-icon"></div>'}</td>
      </tr>
    `;
  });

  const templateContent = {
    main: `
    <div class="court-header">
      <div class="us-tax-court-seal"></div>
      <h1>United States Tax Court</h1>
      <h2>Trial Session Planning Report - ${capitalize(
        selectedTerm,
      )} ${selectedYear}</h2>
    </div>
    <table>
      <thead>
        <tr>
          <th>State</th>
          <th>Location</th>
          <th>All</th>
          <th>Small</th>
          <th>Regular</th>
          <th>${capitalize(previousTerms[0].term)} ${previousTerms[0].year}</th>
          <th>${capitalize(previousTerms[1].term)} ${previousTerms[1].year}</th>
          <th>${capitalize(previousTerms[2].term)} ${previousTerms[2].year}</th>
        </tr>
      </thead>
      <tbody>
        ${contentRows.join('')}
      </tbody>
    </table>
  `,
  };

  const options = {
    overwriteMain: true,
    styles: `
      @page {
        margin: 1.75cm 0cm 1.5cm;
        size: 8.5in 11in;
      }
      @page :first {
        margin-top: 1cm;
        margin-bottom: 2cm;
      }
      .calendar-icon {
        width: 12px;
        height: 12px;
        background: url('data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgZGF0YS1wcmVmaXg9ImZhciIgZGF0YS1pY29uPSJjYWxlbmRhci10aW1lcyIgY2xhc3M9InN2Zy1pbmxpbmUtLWZhIGZhLWNhbGVuZGFyLXRpbWVzIGZhLXctMTQiIHJvbGU9ImltZyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNDQ4IDUxMiI+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNMzExLjcgMzc0LjdsLTE3IDE3Yy00LjcgNC43LTEyLjMgNC43LTE3IDBMMjI0IDMzNy45bC01My43IDUzLjdjLTQuNyA0LjctMTIuMyA0LjctMTcgMGwtMTctMTdjLTQuNy00LjctNC43LTEyLjMgMC0xN2w1My43LTUzLjctNTMuNy01My43Yy00LjctNC43LTQuNy0xMi4zIDAtMTdsMTctMTdjNC43LTQuNyAxMi4zLTQuNyAxNyAwbDUzLjcgNTMuNyA1My43LTUzLjdjNC43LTQuNyAxMi4zLTQuNyAxNyAwbDE3IDE3YzQuNyA0LjcgNC43IDEyLjMgMCAxN0wyNTcuOSAzMDRsNTMuNyA1My43YzQuOCA0LjcgNC44IDEyLjMuMSAxN3pNNDQ4IDExMnYzNTJjMCAyNi41LTIxLjUgNDgtNDggNDhINDhjLTI2LjUgMC00OC0yMS41LTQ4LTQ4VjExMmMwLTI2LjUgMjEuNS00OCA0OC00OGg0OFYxMmMwLTYuNiA1LjQtMTIgMTItMTJoNDBjNi42IDAgMTIgNS40IDEyIDEydjUyaDEyOFYxMmMwLTYuNiA1LjQtMTIgMTItMTJoNDBjNi42IDAgMTIgNS40IDEyIDEydjUyaDQ4YzI2LjUgMCA0OCAyMS41IDQ4IDQ4em0tNDggMzQ2VjE2MEg0OHYyOThjMCAzLjMgMi43IDYgNiA2aDM0MGMzLjMgMCA2LTIuNyA2LTZ6Ij48L3BhdGg+PC9zdmc+');
        background-size: 12px 12px;
      }

      tr {
        break-inside: avoid !important;
      } 
    `,
    title: 'Trial Session Planning Report',
  };

  return generateHTMLTemplateForPDF(templateContent, options);
};

module.exports = {
  generateChangeOfAddressTemplate,
  generateHTMLTemplateForPDF,
  generatePrintableDocketRecordTemplate,
  generatePrintableFilingReceiptTemplate,
  generateTrialCalendarTemplate,
  generateTrialSessionPlanningReportTemplate,
};
