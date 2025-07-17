//    Copyright (c) 2025 Nobene5 authors

//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at

//       http://www.apache.org/licenses/LICENSE-2.0

//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

package main

import (
	"fmt"
	"path"
	"path/filepath"
	"runtime"
	"log"
	"os"
	"io/ioutil"
	"github.com/webview/webview_go"
)

var w webview.WebView

func main() {
	debug := true
	w = webview.New(debug)
	defer w.Destroy()
	w.SetTitle("*")
	w.SetSize(1920, 1060, webview.HintNone)

	w.Navigate("file://" + pathToStartPage())

//	w.Bind("get_fontsize", getFontSize)
	w.Bind("quit_app", quitApp)
	w.Bind("list_boards", listAllBoards)
	w.Bind("write_flag", writeFlag)
//	w.Bind("write_flag_again", writeFlagAgain)
	w.Bind("write_card", writeCard)
	w.Bind("write_board", writeBoard)
	w.Bind("read_board", readBoard)
	w.Bind("copy_file", copyFile)
	w.Bind("create_dir", createDir)
	w.Bind("read_dir", readDir)
	w.Bind("remove_board", removeBoard)
	w.Bind("read_card", readCard)
	w.Bind("read_flag", readFlag)
	w.Bind("read_url", readUrl)
	w.Bind("write_url", writeUrl)
	w.Bind("showtitle", showName)
	w.Bind("open_link", openLink)

	w.Run()
}

//func getFontSize() int {
//	ret, _ := fmt.Print(string(*fsize))
//	return ret
//}

func quitApp() {
	defer w.Terminate()
	defer w.Destroy()
}

func listAllBoards() []string {
	files, err := filepath.Glob("store/boards/*")
	if err != nil {
		log.Fatal(err)
	}
//	fmt.Println(files)
	return files
}

func readDir(dir string) []string {
	files1, err10 := filepath.Glob(dir + "/*")
	if err10 != nil {
		log.Fatal(err10)
	}
//	fmt.Println(files1)
	return files1
}

func showName(name string) {
	fmt.Println("board name : " + name)

	w.SetTitle("                                                                                                                                                                                                                                  " + name)
	return
}

func writeFlag(fn2, cn string) {
	if err4 := os.WriteFile(fn2, []byte(cn), 0666); err4 != nil {
		log.Fatal(err4)
	}
}

func writeCard(fn, content string) {
	if err2 := os.WriteFile(fn, []byte(content), 0666); err2 != nil {
		log.Fatal(err2)
	}
}

func writeBoard(fac, ac string) {
	if err3 := os.WriteFile(fac, []byte(ac), 0666); err3 != nil {
		log.Fatal(err3)
	}
}

func readBoard(bname string) string {
	brd, err7 := ioutil.ReadFile(bname)
	if err7 != nil {
		fmt.Println(err7)
		return err7.Error()
	}
	return string(brd)
}

func writeUrl(udir, u string) {
	if err11 := os.WriteFile(udir, []byte(u), 0666); err11 != nil {
		log.Fatal(err11)
	}
}

func readUrl(usaved string) string {
	url, err12 := ioutil.ReadFile(usaved)
	if err12 != nil {
		fmt.Println(err12)
		return err12.Error()
	}
	return "http://" + string(url)
}

func copyFile(in, out string) (int64, error) {
	i, e := os.Open(in)
	if e != nil { return 0, e}
	defer i.Close()
	o, e := os.Create(out)
	if e != nil { return 0, e}
	defer o.Close()
	return o.ReadFrom(i)
}

func createDir(where string) {
	err9 := os.Mkdir(where, 0755)
	if err9 != nil {
		fmt.Println(err9)
	}
	return
}

func removeBoard(bnam string) {
	err8 := os.Remove(bnam)
	if err8 != nil {
		fmt.Println(err8)
	}
	return
}

func readCard(cid string) string {
	cont, err5 := ioutil.ReadFile(cid)
	if err5 != nil {
		fmt.Println(err5)
		return err5.Error()
	}
	return string(cont)
}

func readFlag(fid string) string {
	flg, err6 := ioutil.ReadFile(fid)
	if err6 != nil {
		fmt.Println(err6)
		return err6.Error()
	}
	return string(flg)
}

func openLink(link string) {
	w.Navigate(link)
	return
}

func pathToStartPage() string {
	_, currentFile, _, _ := runtime.Caller(0)
	dir := path.Dir(currentFile)
	return path.Join(dir, "nobene5.html")
}
